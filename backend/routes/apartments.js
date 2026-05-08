const express = require('express');
const router = express.Router();
const { db } = require('../db/setup');

router.get('/', (req, res) => {
  const { project_slug, parent_slug, is_hot, limit, bedrooms, listing_type, search } = req.query;

  let slugFilter = [];
  if (project_slug) {
    slugFilter = [project_slug];
  } else if (parent_slug) {
    // Get all child project slugs under this parent
    const parent = db.prepare('SELECT id FROM projects WHERE slug = ?').get(parent_slug);
    if (parent) {
      const children = db.prepare('SELECT slug FROM projects WHERE parent_id = ?').all(parent.id);
      slugFilter = children.map(c => c.slug);
      // Also include apartments directly under the parent slug
      slugFilter.push(parent_slug);
    }
  }

  let query = 'SELECT * FROM apartments WHERE 1=1';
  const params = [];

  if (slugFilter.length > 0) {
    query += ` AND project_slug IN (${slugFilter.map(() => '?').join(',')})`;
    params.push(...slugFilter);
  }
  if (listing_type) {
    query += ' AND listing_type = ?';
    params.push(listing_type);
  }
  if (is_hot === '1') {
    query += ' AND is_hot = 1';
  }
  if (bedrooms) {
    query += ' AND bedrooms = ?';
    params.push(parseInt(bedrooms));
  }
  if (search) {
    const kw = `%${search}%`;
    query += ' AND (title LIKE ? OR location LIKE ? OR project_name LIKE ? OR short_desc LIKE ? OR district LIKE ?)';
    params.push(kw, kw, kw, kw, kw);
  }

  query += ' ORDER BY is_hot DESC, created_at DESC';
  if (limit) {
    query += ' LIMIT ?';
    params.push(parseInt(limit));
  }

  const apartments = db.prepare(query).all(...params);
  apartments.forEach(a => { if (a.images) a.images = JSON.parse(a.images); });
  res.json(apartments);
});

router.get('/:id', (req, res) => {
  const apt = db.prepare('SELECT * FROM apartments WHERE id = ?').get(req.params.id);
  if (!apt) return res.status(404).json({ message: 'Not found' });
  if (apt.images) apt.images = JSON.parse(apt.images);

  // Related: same project, same listing_type, different id
  const related = db.prepare(
    'SELECT * FROM apartments WHERE project_slug = ? AND listing_type = ? AND id != ? LIMIT 3'
  ).all(apt.project_slug, apt.listing_type, apt.id);
  related.forEach(a => { if (a.images) a.images = JSON.parse(a.images); });

  res.json({ ...apt, related });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { db } = require('../db/setup');

router.get('/', (req, res) => {
  const { area, is_hot, limit, bedrooms } = req.query;
  let query = 'SELECT * FROM apartments WHERE 1=1';
  const params = [];

  if (area) {
    query += ' AND area_slug = ?';
    params.push(area);
  }
  if (is_hot === '1') {
    query += ' AND is_hot = 1';
  }
  if (bedrooms) {
    query += ' AND bedrooms = ?';
    params.push(parseInt(bedrooms));
  }
  query += ' ORDER BY is_hot DESC, created_at DESC';
  if (limit) {
    query += ' LIMIT ?';
    params.push(parseInt(limit));
  }

  const apartments = db.prepare(query).all(...params);
  apartments.forEach(a => {
    if (a.images) a.images = JSON.parse(a.images);
  });
  res.json(apartments);
});

router.get('/:id', (req, res) => {
  const apt = db.prepare('SELECT * FROM apartments WHERE id = ?').get(req.params.id);
  if (!apt) return res.status(404).json({ message: 'Not found' });
  if (apt.images) apt.images = JSON.parse(apt.images);
  const related = db.prepare('SELECT * FROM apartments WHERE area_slug = ? AND id != ? LIMIT 3').all(apt.area_slug, apt.id);
  related.forEach(a => { if (a.images) a.images = JSON.parse(a.images); });
  res.json({ ...apt, related });
});

module.exports = router;

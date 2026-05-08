const express = require('express');
const router = express.Router();
const { db } = require('../db/setup');

const ADMIN_KEY = 'oanhomes2024';

function auth(req, res) {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) {
    res.status(401).json({ message: 'Unauthorized' });
    return false;
  }
  return true;
}

// ─── CONTACTS ────────────────────────────────────────────────────────────────

router.get('/contacts', (req, res) => {
  if (!auth(req, res)) return;
  res.json(db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all());
});

router.delete('/contacts/:id', (req, res) => {
  if (!auth(req, res)) return;
  db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ─── APARTMENTS ───────────────────────────────────────────────────────────────

router.get('/apartments', (req, res) => {
  if (!auth(req, res)) return;
  const { search, project_slug, listing_type } = req.query;
  let q = 'SELECT * FROM apartments WHERE 1=1';
  const params = [];
  if (search) {
    q += ' AND (title LIKE ? OR project_name LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (project_slug) { q += ' AND project_slug = ?'; params.push(project_slug); }
  if (listing_type) { q += ' AND listing_type = ?'; params.push(listing_type); }
  q += ' ORDER BY created_at DESC';
  const apts = db.prepare(q).all(...params);
  apts.forEach(a => { try { if (a.images) a.images = JSON.parse(a.images); } catch { a.images = []; } });
  res.json(apts);
});

router.post('/apartments', (req, res) => {
  if (!auth(req, res)) return;
  const {
    title, project_slug, listing_type, price, price_display,
    bedrooms, bathrooms, size, short_desc, description,
    location, district, floor, direction, legal,
    image, images, is_hot, status
  } = req.body;

  if (!title || !project_slug) return res.status(400).json({ message: 'title và project_slug là bắt buộc' });

  const proj = db.prepare('SELECT id, name FROM projects WHERE slug = ?').get(project_slug);
  if (!proj) return res.status(400).json({ message: 'Dự án không tồn tại' });

  const imagesJson = Array.isArray(images) ? JSON.stringify(images)
    : typeof images === 'string' && images.trim()
      ? JSON.stringify(images.split('\n').map(s => s.trim()).filter(Boolean))
      : null;

  const result = db.prepare(`
    INSERT INTO apartments
      (title, project_id, project_name, project_slug, listing_type, price, price_display,
       bedrooms, bathrooms, size, short_desc, description, location, district, floor,
       direction, legal, image, images, is_hot, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    title, proj.id, proj.name, project_slug,
    listing_type || 'ban', Number(price) || 0,
    price_display || String(price),
    Number(bedrooms) || 0, Number(bathrooms) || 0, Number(size) || 0,
    short_desc || '', description || '',
    location || '', district || '', floor || '', direction || '', legal || '',
    image || '', imagesJson,
    is_hot ? 1 : 0, status || 'available'
  );

  const created = db.prepare('SELECT * FROM apartments WHERE id = ?').get(result.lastInsertRowid);
  try { if (created.images) created.images = JSON.parse(created.images); } catch { created.images = []; }
  res.json(created);
});

router.put('/apartments/:id', (req, res) => {
  if (!auth(req, res)) return;
  const {
    title, project_slug, listing_type, price, price_display,
    bedrooms, bathrooms, size, short_desc, description,
    location, district, floor, direction, legal,
    image, images, is_hot, status
  } = req.body;

  const proj = db.prepare('SELECT id, name FROM projects WHERE slug = ?').get(project_slug);
  if (!proj) return res.status(400).json({ message: 'Dự án không tồn tại' });

  const imagesJson = Array.isArray(images) ? JSON.stringify(images)
    : typeof images === 'string' && images.trim()
      ? JSON.stringify(images.split('\n').map(s => s.trim()).filter(Boolean))
      : null;

  db.prepare(`
    UPDATE apartments SET
      title=?, project_id=?, project_name=?, project_slug=?, listing_type=?,
      price=?, price_display=?, bedrooms=?, bathrooms=?, size=?,
      short_desc=?, description=?, location=?, district=?, floor=?,
      direction=?, legal=?, image=?, images=?, is_hot=?, status=?
    WHERE id=?
  `).run(
    title, proj.id, proj.name, project_slug,
    listing_type || 'ban', Number(price) || 0,
    price_display || String(price),
    Number(bedrooms) || 0, Number(bathrooms) || 0, Number(size) || 0,
    short_desc || '', description || '',
    location || '', district || '', floor || '', direction || '', legal || '',
    image || '', imagesJson,
    is_hot ? 1 : 0, status || 'available',
    req.params.id
  );
  res.json({ ok: true });
});

router.delete('/apartments/:id', (req, res) => {
  if (!auth(req, res)) return;
  db.prepare('DELETE FROM apartments WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

router.get('/projects', (req, res) => {
  if (!auth(req, res)) return;
  const all = db.prepare('SELECT * FROM projects ORDER BY sort_order, id').all();
  const top = all.filter(p => !p.parent_id);
  top.forEach(p => { p.children = all.filter(c => c.parent_id === p.id); });
  res.json(top);
});

router.post('/projects', (req, res) => {
  if (!auth(req, res)) return;
  const { name, slug, parent_slug, count_text, image, description, sort_order } = req.body;
  if (!name || !slug) return res.status(400).json({ message: 'name và slug là bắt buộc' });

  let parent_id = null;
  if (parent_slug) {
    const parent = db.prepare('SELECT id FROM projects WHERE slug = ?').get(parent_slug);
    if (!parent) return res.status(400).json({ message: 'parent_slug không tồn tại' });
    parent_id = parent.id;
  }
  try {
    const result = db.prepare(
      'INSERT INTO projects (name, slug, parent_id, count_text, image, description, sort_order) VALUES (?,?,?,?,?,?,?)'
    ).run(name, slug, parent_id, count_text || '', image || '', description || '', sort_order || 0);
    res.json({ id: result.lastInsertRowid, ok: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/projects/:id', (req, res) => {
  if (!auth(req, res)) return;
  const { name, count_text, image, description, sort_order } = req.body;
  db.prepare('UPDATE projects SET name=?, count_text=?, image=?, description=?, sort_order=? WHERE id=?')
    .run(name, count_text || '', image || '', description || '', sort_order || 0, req.params.id);
  res.json({ ok: true });
});

router.delete('/projects/:id', (req, res) => {
  if (!auth(req, res)) return;
  const id = req.params.id;
  // Reassign child projects to null parent
  db.prepare('UPDATE projects SET parent_id = NULL WHERE parent_id = ?').run(id);
  // Detach apartments (keep them, just clear project link)
  db.prepare("UPDATE apartments SET project_id = NULL, project_name = '', project_slug = '' WHERE project_id = ?").run(id);
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  res.json({ ok: true });
});

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

router.get('/testimonials', (req, res) => {
  if (!auth(req, res)) return;
  res.json(db.prepare('SELECT * FROM testimonials ORDER BY id DESC').all());
});

router.post('/testimonials', (req, res) => {
  if (!auth(req, res)) return;
  const { name, location, avatar, content, rating } = req.body;
  if (!name || !content) return res.status(400).json({ message: 'name và content là bắt buộc' });
  const result = db.prepare(
    'INSERT INTO testimonials (name, location, avatar, content, rating) VALUES (?,?,?,?,?)'
  ).run(name, location || '', avatar || '', content, Number(rating) || 5);
  res.json({ id: result.lastInsertRowid, ok: true });
});

router.put('/testimonials/:id', (req, res) => {
  if (!auth(req, res)) return;
  const { name, location, avatar, content, rating } = req.body;
  db.prepare('UPDATE testimonials SET name=?, location=?, avatar=?, content=?, rating=? WHERE id=?')
    .run(name, location || '', avatar || '', content, Number(rating) || 5, req.params.id);
  res.json({ ok: true });
});

router.delete('/testimonials/:id', (req, res) => {
  if (!auth(req, res)) return;
  db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;

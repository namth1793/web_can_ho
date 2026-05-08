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

router.get('/contacts', (req, res) => {
  if (!auth(req, res)) return;
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  res.json(contacts);
});

// Project management endpoints
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
      'INSERT INTO projects (name, slug, parent_id, count_text, image, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
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

module.exports = router;

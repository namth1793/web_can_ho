const express = require('express');
const router = express.Router();
const { db } = require('../db/setup');

const ADMIN_KEY = 'oanhomes2024';

// GET all top-level projects (or all with parent info)
router.get('/', (req, res) => {
  const { parent_slug, include_children } = req.query;

  if (parent_slug) {
    const parent = db.prepare('SELECT * FROM projects WHERE slug = ?').get(parent_slug);
    if (!parent) return res.json([]);
    const children = db.prepare('SELECT * FROM projects WHERE parent_id = ? ORDER BY sort_order, id').all(parent.id);
    return res.json(children);
  }

  // Return all projects with children nested
  const all = db.prepare('SELECT * FROM projects ORDER BY sort_order, id').all();
  if (include_children) {
    const top = all.filter(p => !p.parent_id);
    top.forEach(p => {
      p.children = all.filter(c => c.parent_id === p.id);
    });
    return res.json(top);
  }
  res.json(all);
});

// GET single project by slug (with children)
router.get('/:slug', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE slug = ?').get(req.params.slug);
  if (!project) return res.status(404).json({ message: 'Not found' });
  const children = db.prepare('SELECT * FROM projects WHERE parent_id = ? ORDER BY sort_order, id').all(project.id);
  let parent = null;
  if (project.parent_id) {
    parent = db.prepare('SELECT * FROM projects WHERE id = ?').get(project.parent_id);
  }
  res.json({ ...project, children, parent });
});

// POST add new project (admin only)
router.post('/', (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(403).json({ message: 'Forbidden' });
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
    const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.json(created);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// PUT update project (admin only)
router.put('/:id', (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(403).json({ message: 'Forbidden' });
  const { name, count_text, image, description, sort_order } = req.body;
  db.prepare('UPDATE projects SET name=?, count_text=?, image=?, description=?, sort_order=? WHERE id=?')
    .run(name, count_text, image, description, sort_order || 0, req.params.id);
  res.json({ ok: true });
});

module.exports = router;

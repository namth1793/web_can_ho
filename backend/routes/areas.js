const express = require('express');
const router = express.Router();
const { db } = require('../db/setup');

router.get('/', (req, res) => {
  const areas = db.prepare('SELECT * FROM areas').all();
  res.json(areas);
});

router.get('/:slug', (req, res) => {
  const area = db.prepare('SELECT * FROM areas WHERE slug = ?').get(req.params.slug);
  if (!area) return res.status(404).json({ message: 'Not found' });
  res.json(area);
});

module.exports = router;

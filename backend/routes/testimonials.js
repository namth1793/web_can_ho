const express = require('express');
const router = express.Router();
const { db } = require('../db/setup');

router.get('/', (req, res) => {
  const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY id').all();
  res.json(testimonials);
});

module.exports = router;

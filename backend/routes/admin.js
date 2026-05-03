const express = require('express');
const router = express.Router();
const { db } = require('../db/setup');

const ADMIN_KEY = 'oanhomes2024';

router.get('/contacts', (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  res.json(contacts);
});

module.exports = router;

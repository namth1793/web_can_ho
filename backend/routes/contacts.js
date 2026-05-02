const express = require('express');
const router = express.Router();
const { db } = require('../db/setup');

router.post('/', (req, res) => {
  const { phone, area, price_range, bedrooms, message } = req.body;
  if (!phone) return res.status(400).json({ message: 'Vui lòng nhập số điện thoại' });

  db.prepare('INSERT INTO contacts (phone, area, price_range, bedrooms, message) VALUES (?, ?, ?, ?, ?)').run(
    phone, area || null, price_range || null, bedrooms || null, message || null
  );
  res.json({ success: true, message: 'Yêu cầu của bạn đã được ghi nhận!' });
});

router.get('/', (req, res) => {
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  res.json(contacts);
});

module.exports = router;

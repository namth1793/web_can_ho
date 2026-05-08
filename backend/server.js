require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { setupDatabase } = require('./db/setup');

const app = express();
const PORT = process.env.PORT || 5021;

app.use(cors({ origin: '*' }));
app.use(express.json());

setupDatabase();

// ─── SSE real-time sync ───────────────────────────────────────────────────────
let sseClients = [];

function notifyChange(type = 'update') {
  const msg = `data: ${JSON.stringify({ type, ts: Date.now() })}\n\n`;
  sseClients = sseClients.filter(res => {
    try { res.write(msg); return true; } catch { return false; }
  });
}

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // Heartbeat every 25s to keep connection alive
  const hb = setInterval(() => {
    try { res.write(': ping\n\n'); } catch { clearInterval(hb); }
  }, 25000);

  sseClients.push(res);

  req.on('close', () => {
    clearInterval(hb);
    sseClients = sseClients.filter(c => c !== res);
  });
});

// Export notifyChange for use in routes
app.locals.notifyChange = notifyChange;

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/apartments', require('./routes/apartments'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/areas', require('./routes/areas'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/upload', require('./routes/upload'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

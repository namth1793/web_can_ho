const express = require('express');
const cors = require('cors');
const { setupDatabase } = require('./db/setup');

const app = express();
const PORT = process.env.PORT || 5021;

app.use(cors({ origin: '*' }));
app.use(express.json());

setupDatabase();

app.use('/api/apartments', require('./routes/apartments'));
app.use('/api/areas', require('./routes/areas'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/admin', require('./routes/admin'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

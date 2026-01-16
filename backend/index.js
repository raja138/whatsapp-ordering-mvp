const express = require('express');
const { setupWhatsAppWebhook } = require('./webhook');
const { initializeDatabase } = require('./db');
const { getActiveDeliveries } = require('./delivery');
const db = require('./db');

const app = express();
app.use(express.json());

// Initialize database
initializeDatabase();

// WhatsApp webhook routes
app.post('/webhook', setupWhatsAppWebhook);

// API endpoints for dashboard
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows || []);
    }
  });
});

app.get('/api/deliveries', (req, res) => {
  getActiveDeliveries((deliveries) => {
    res.json(deliveries);
  });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

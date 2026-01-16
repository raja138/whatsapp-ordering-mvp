const express = require('express');
const { verifyWebhook, handleWhatsAppMessage } = require('./webhook');
const { initializeDatabase } = require('./db');
const { getActiveDeliveries } = require('./delivery');
const db = require('./db');

const app = express();
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Init DB
initializeDatabase();

// ✅ CORRECT webhook wiring
app.get('/webhook', verifyWebhook);
app.post('/webhook', handleWhatsAppMessage);

// Dashboard APIs
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows || []);
  });
});

app.get('/api/deliveries', (req, res) => {
  getActiveDeliveries((deliveries) => {
    res.json(deliveries);
  });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  db.run(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, req.params.id],
    (err) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ success: true });
    }
  );
});

// ⚠️ Railway-safe port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

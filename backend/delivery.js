const db = require('./db');

function updateDeliveryStatus(orderId, status) {
  const stmt = 'UPDATE orders SET status = ? WHERE id = ?';
  db.run(stmt, [status, orderId], (err) => {
    if (err) console.error('Update error:', err);
  });
}

function getActiveDeliveries(callback) {
  const stmt = 'SELECT * FROM orders WHERE status IN (?, ?)';
  db.all(stmt, ['processing', 'out_for_delivery'], (err, rows) => {
    if (err) console.error('Query error:', err);
    callback(rows || []);
  });
}

module.exports = { updateDeliveryStatus, getActiveDeliveries };

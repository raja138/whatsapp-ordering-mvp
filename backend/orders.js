const db = require('./db');
const menu = require('../menu.json');

async function handleIncomingMessage(message) {
  const { from, text } = message;
  
  // Parse order from message
  if (text.toLowerCase().includes('order') || text.toLowerCase().includes('want')) {
    const order = parseOrder(text);
    saveOrder(from, order);
  }
}

function parseOrder(text) {
  // Simple order parsing logic
  return {
    items: extractItems(text),
    timestamp: new Date(),
  };
}

function extractItems(text) {
  return menu.items.filter(item => 
    text.toLowerCase().includes(item.name.toLowerCase())
  );
}

function saveOrder(customerId, order) {
  const stmt = 'INSERT INTO orders (customer_id, items, status) VALUES (?, ?, ?)';
  db.run(stmt, [customerId, JSON.stringify(order.items), 'pending'], (err) => {
    if (err) console.error('Insert error:', err);
    else console.log(`Order saved for customer ${customerId}`);
  });
}

module.exports = { handleIncomingMessage };

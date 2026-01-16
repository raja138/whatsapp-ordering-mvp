const { handleIncomingMessage } = require('./orders');

async function setupWhatsAppWebhook(req, res) {
  try {
    const { entry } = req.body;
    
    for (const item of entry) {
      for (const change of item.changes) {
        const message = change.value.messages?.[0];
        if (message) {
          await handleIncomingMessage(message);
        }
      }
    }
    
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { setupWhatsAppWebhook };

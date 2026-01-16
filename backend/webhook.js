const { handleIncomingMessage } = require('./orders');

// Handle GET requests for webhook verification (Meta requirement)
function handleWebhookVerification(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'test_token';
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified by Meta');
    res.status(200).send(challenge);
  } else {
    console.error('Webhook verification failed');
    res.status(403).json({ error: 'Verification failed' });
  }
}

// Handle POST requests for incoming messages
async function handleWebhookMessages(req, res) {
  try {
    const { entry } = req.body;
    
    if (!entry) {
      return res.status(200).json({ status: 'ok' });
    }
    
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

// Main webhook handler that routes GET and POST
async function setupWhatsAppWebhook(req, res) {
  if (req.method === 'GET') {
    return handleWebhookVerification(req, res);
  } else if (req.method === 'POST') {
    return handleWebhookMessages(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

module.exports = { setupWhatsAppWebhook };

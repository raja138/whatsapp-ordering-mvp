const axios = require("axios");

const VERIFY_TOKEN = "my_whatsapp_webhook_token";

function verifyWebhook(req, res) {
  console.log("📨 GET /webhook request received");
  console.log("Query params:", req.query);

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified by Meta");
    return res.status(200).send(challenge);
  }

  console.log("❌ Webhook verification failed");
  return res.sendStatus(403);
}

function handleWhatsAppMessage(req, res) {
  console.log("🔥 WHATSAPP POST RECEIVED");
  console.log(JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;
  const message = value?.messages?.[0];

  if (!message) {
    console.log("ℹ️ No message in payload (status update or non-message event)");
    return res.sendStatus(200);
  }

  const from = message.from;
  const text = message.text?.body;

  console.log("📩 From:", from);
  console.log("💬 Text:", text);

  return res.sendStatus(200);
}

module.exports = {
  verifyWebhook,
  handleWhatsAppMessage
};

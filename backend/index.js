const express = require("express");
const app = express();

app.use(express.json());

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "my_whatsapp_webhook_token";

  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === VERIFY_TOKEN
  ) {
    console.log("✅ Webhook verification request received");
    return res.send(req.query["hub.challenge"]);
  }

  return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("🔥 WHATSAPP MESSAGE RECEIVED");
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(8080, () => {
  console.log("🚀 Server running on port 8080");
});

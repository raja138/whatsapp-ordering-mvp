# WhatsApp Ordering MVP

A minimal viable product for automating food orders through WhatsApp with a delivery tracking dashboard.

**[🚀 Deploy to Cloud](#-deployment)** | **[📖 Architecture Docs](./.github/copilot-instructions.md)** | **[🔧 Setup Guide](#-quick-start)**

## 🚀 Quick Start

### Local Development
```bash
npm install
npm start          # Runs on http://localhost:3000
npm run dev        # With auto-reload
```

### Testing Webhook
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "+1234567890",
            "text": "I want a burger and coke"
          }]
        }
      }]
    }]
  }'
```

### Check Orders
```bash
curl http://localhost:3000/api/orders
```

## 📋 Project Structure

```
├── backend/
│   ├── index.js          # Express server & API routes
│   ├── webhook.js        # WhatsApp webhook handler
│   ├── orders.js         # Order parsing logic
│   ├── delivery.js       # Delivery status management
│   └── db.js             # SQLite database setup
├── dashboard/
│   ├── pages/
│   │   └── index.tsx     # Dashboard UI
│   └── components/       # React components
├── menu.json             # Menu items catalog
└── package.json          # Dependencies
```

## 🔌 API Endpoints

- `POST /webhook` - WhatsApp message webhook
- `GET /api/orders` - List all orders
- `GET /api/deliveries` - Active deliveries
- `PUT /api/orders/:id/status` - Update order status

## 🔧 Environment Variables

Create a `.env` file (copy from `.env.example`):
```bash
PORT=3000
WHATSAPP_API_TOKEN=your_token_here
WHATSAPP_VERIFY_TOKEN=your_verify_token_here
```

## 📦 Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Dashboard**: React + TypeScript (Next.js)
- **Deployment**: Cloud-ready (Railway, Render, Heroku, etc.)

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed cloud deployment instructions.

**Quick Deploy to Railway** (recommended):
```bash
# 1. Create GitHub repo
git add .
git commit -m "Initial WhatsApp ordering MVP"
git push origin main

# 2. Go to https://railway.app
# 3. Connect GitHub → Select this repo
# 4. Add environment variables in dashboard
# ✅ Done! Auto-deploys on every push
```

## 📝 Notes

- Order parsing uses case-insensitive substring matching
- Currently local-only; requires WhatsApp Business API for production
- Dashboard components are placeholders - implement order/delivery UI
- Uses SQLite; migrate to PostgreSQL for production persistence

# 🚀 Quick Deployment Guide

Your WhatsApp Ordering MVP is ready to deploy! Here's the fastest path to production.

## Step 1: Create GitHub Repository

```bash
cd /Users/harshsingh/Desktop/whatsappAutomation

# Create new repo on GitHub first at https://github.com/new
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/whatsapp-ordering-mvp.git
git branch -M main
git push -u origin main
```

## Step 2: Choose Your Platform & Deploy

### ⚡ Fastest: Railway (1 minute setup)

1. Go to https://railway.app
2. Click "Create New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `whatsapp-ordering-mvp` repository
5. Wait for deployment (1-2 minutes)
6. Add Environment Variables in Railway dashboard:
   ```
   PORT=3000
   WHATSAPP_API_TOKEN=your_whatsapp_token
   WHATSAPP_VERIFY_TOKEN=your_webhook_token
   ```

**Done!** Your app is live. Railway gives you a URL like:
```
https://whatsapp-ordering-mvp-prod.railway.app
```

### Alternative: Render (Similar to Railway)

1. Go to https://render.com
2. Click "Create New" → "Web Service"
3. Connect GitHub
4. Select repository
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables
8. Deploy!

## Step 3: Update WhatsApp Webhook URL

In your WhatsApp Business API Dashboard:

1. Go to App Settings → Webhooks
2. Set Callback URL to: `https://your-deployed-app-url.com/webhook`
3. Verify Token: Use your `WHATSAPP_VERIFY_TOKEN` value
4. Subscribe to: `messages` events

## Step 4: Test Deployed App

```bash
# Replace with your actual deployed URL
DEPLOYED_URL="https://your-app.railway.app"

# Test webhook
curl -X POST $DEPLOYED_URL/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "+1234567890",
            "text": "I want a burger"
          }]
        }
      }]
    }]
  }'

# Check orders
curl $DEPLOYED_URL/api/orders
```

## Troubleshooting

**App crashes on deploy?**
- Check logs in Railway/Render dashboard
- Make sure all environment variables are set
- Verify `PORT` is set to `3000`

**SQLite database not persisting?**
- SQLite files are ephemeral on cloud platforms
- For production: migrate to PostgreSQL
- See DEPLOYMENT.md for PostgreSQL setup

**Orders not saving?**
- Check webhook logs in dashboard
- Verify WhatsApp API token is correct
- Test with curl first (local testing)

## Next Steps

1. ✅ Deploy to cloud
2. 📦 Get WhatsApp Business API credentials
3. 🎨 Implement dashboard UI (OrdersList, DeliveryMap)
4. 🗄️ Migrate from SQLite to PostgreSQL
5. 🔐 Add authentication
6. 📊 Set up monitoring (Sentry, DataDog)

## Files to Know

- **DEPLOYMENT.md** - Detailed platform-specific setup
- **.github/copilot-instructions.md** - Architecture & code patterns
- **README.md** - Project overview
- **backend/index.js** - All API endpoints defined here
- **backend/webhook.js** - WhatsApp message handler
- **backend/orders.js** - Order parsing logic

## Need Help?

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **WhatsApp API**: https://developers.facebook.com/docs/whatsapp
- **Project Docs**: See `.github/copilot-instructions.md`

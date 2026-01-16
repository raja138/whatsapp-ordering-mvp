# Deployment Guide

## Choose Your Platform

### Option 1: Railway (Recommended - Free Tier)

1. **Create Railway Account**
   ```bash
   # Go to https://railway.app and sign up with GitHub
   ```

2. **Connect GitHub Repository**
   - Link your GitHub account
   - Select the `whatsappAutomation` repo
   - Railway auto-deploys on every push

3. **Set Environment Variables**
   In Railway Dashboard → Variables:
   ```
   PORT=3000
   WHATSAPP_API_TOKEN=your_token_here
   WHATSAPP_VERIFY_TOKEN=your_verify_token_here
   ```

4. **Deploy**
   Your app will be live at `https://[project]-[env].railway.app`

---

### Option 2: Render (Free Tier Available)

1. **Create Render Account**
   ```bash
   # Go to https://render.com and sign up with GitHub
   ```

2. **Create New Web Service**
   - Connect GitHub repo
   - Runtime: Node
   - Build: `npm install`
   - Start: `npm start`

3. **Add Environment Variables** in Render Dashboard

4. **Deploy** - Auto-deploys on GitHub push

---

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   brew tap heroku/brew && brew install heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set WHATSAPP_API_TOKEN=your_token_here
   heroku config:set WHATSAPP_VERIFY_TOKEN=your_verify_token_here
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

---

### Option 4: DigitalOcean App Platform

1. **Create DigitalOcean Account** and link GitHub
2. **Create New App** → Select your repo
3. **Configure**: Build & Start commands match package.json
4. **Deploy** → Get live URL

---

## GitHub Setup (All Platforms)

1. **Create GitHub Repository**
   ```bash
   cd /Users/harshsingh/Desktop/whatsappAutomation
   git add .
   git commit -m "Initial WhatsApp ordering MVP"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/whatsapp-ordering-mvp.git
   git push -u origin main
   ```

2. **Add .gitignore**
   ```
   node_modules/
   .env
   *.log
   db.sqlite
   ```

---

## WhatsApp Business API Setup

1. **Get Business Account** at https://www.facebook.com/business
2. **Create App** in Meta App Dashboard
3. **Configure Webhook**
   - Callback URL: `https://your-deployed-app.com/webhook`
   - Verify Token: Set in env variables
4. **Get API Token** and add to environment

---

## Post-Deployment Testing

```bash
# Get your deployed URL (e.g., from Railway/Render dashboard)
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

---

## Database & Persistence

⚠️ **Important**: SQLite files are ephemeral on most cloud platforms.

**Solution for Production:**
- Upgrade to PostgreSQL (Railway/Render provide free tier)
- Update `backend/db.js` to use `pg` package
- Migrate schema to PostgreSQL

Example Railway PostgreSQL setup:
```bash
# Railway auto-injects DATABASE_URL env var
# Update db.js to use PostgreSQL instead of SQLite
npm install pg
```

---

## Monitoring & Logs

**Railway**: Dashboard → Deployments → View logs
**Render**: Dashboard → Logs tab
**Heroku**: `heroku logs --tail`
**DigitalOcean**: App Platform → App-level logs

---

## Next Steps

- [ ] Implement dashboard UI (OrdersList, DeliveryMap components)
- [ ] Migrate from SQLite to PostgreSQL for persistence
- [ ] Add authentication/authorization
- [ ] Set up WhatsApp Business API integration
- [ ] Add error logging & monitoring (e.g., Sentry)
- [ ] Set up CI/CD pipeline

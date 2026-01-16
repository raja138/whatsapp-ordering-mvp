# ✅ Deployment Checklist

## Before You Deploy

- [ ] **GitHub Account** - Create one at https://github.com
- [ ] **GitHub Repository** - Created and code pushed
- [ ] **Cloud Platform Account** - Railway, Render, or Heroku
- [ ] **WhatsApp Business Account** - For production API credentials

---

## Pre-Deployment Setup

### 1. Create GitHub Repository
```bash
cd /Users/harshsingh/Desktop/whatsappAutomation

# Create repo at https://github.com/new first!
git remote add origin https://github.com/YOUR_USERNAME/whatsapp-ordering-mvp.git
git branch -M main
git push -u origin main
```

**Verify:**
```bash
git remote -v
# Should show: origin https://github.com/YOUR_USERNAME/whatsapp-ordering-mvp.git
```

### 2. Prepare Environment Variables

Copy `.env.example` to understand what's needed:
```bash
cat .env.example
```

**Required variables:**
- `PORT=3000` (for cloud deployment)
- `WHATSAPP_API_TOKEN=` (get from Meta dashboard)
- `WHATSAPP_VERIFY_TOKEN=` (create a random string)

---

## Deployment Steps

### Option A: Railway (Recommended ⭐)

1. **Create Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create Project**
   - Click "Create New Project"
   - Select "Deploy from GitHub"
   - Choose `whatsapp-ordering-mvp`

3. **Configure Environment**
   - Dashboard → Variables
   - Add:
     ```
     PORT=3000
     WHATSAPP_API_TOKEN=your_token_here
     WHATSAPP_VERIFY_TOKEN=your_verify_token_here
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Get your URL: `https://[project-name].railway.app`

5. **Test**
   ```bash
   curl https://[project-name].railway.app/api/orders
   ```

### Option B: Render

1. **Create Account** - https://render.com
2. **New Web Service**
   - Connect GitHub repo
   - Build: `npm install`
   - Start: `npm start`
3. **Environment Variables** - Add same as Railway
4. **Deploy** - Click "Create Web Service"

### Option C: Heroku

```bash
# Install CLI
brew install heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set vars
heroku config:set WHATSAPP_API_TOKEN=token
heroku config:set WHATSAPP_VERIFY_TOKEN=token

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## Post-Deployment

### 1. Verify App is Running
```bash
# Get your deployed URL from dashboard
curl https://your-app-url.com/api/orders
# Should return: [] (empty array)
```

### 2. Update WhatsApp Webhook

In Meta App Dashboard → WhatsApp → Settings:

1. **Webhook URL**: `https://your-app-url.com/webhook`
2. **Verify Token**: Your `WHATSAPP_VERIFY_TOKEN` value
3. **Subscribe Events**: `messages`

Test webhook verification:
```bash
# Meta will send a GET request to verify
# Make sure your token matches!
```

### 3. Test with Real Message

```bash
curl -X POST https://your-app-url.com/webhook \
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
```

Check orders:
```bash
curl https://your-app-url.com/api/orders
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **App won't deploy** | Check build logs in dashboard; ensure npm install works locally |
| **Port errors** | Make sure `PORT=3000` is set in environment variables |
| **Orders not saving** | Check webhook logs; verify database is initialized |
| **Webhook not working** | Verify callback URL in Meta dashboard matches exactly |
| **Database empty after restart** | SQLite is ephemeral; migrate to PostgreSQL for persistence |

---

## Next: Production Improvements

- [ ] **Database**: Migrate from SQLite to PostgreSQL
  - Railway/Render offer free PostgreSQL tier
  - Update `backend/db.js` to use `pg` package

- [ ] **Logging**: Add error tracking
  - Try Sentry (free tier)
  - Or simple file logging

- [ ] **Dashboard UI**: Implement React components
  - `OrdersList` component in `dashboard/components/`
  - `DeliveryMap` component in `dashboard/components/`

- [ ] **Security**: Add authentication
  - API key validation
  - WhatsApp signature verification

- [ ] **Monitoring**: Set up alerts
  - Failed orders
  - API errors
  - Database issues

---

## Handy Commands

```bash
# View current git status
git status

# See deployment on Railway
# Dashboard: https://railway.app

# View live logs
# Railway: Dashboard → Logs
# Render: Dashboard → Logs
# Heroku: heroku logs --tail

# View environment variables
# Railway: Dashboard → Variables
# Render: Settings → Environment
# Heroku: heroku config

# Rollback to previous version
# Railway: Deployments tab → Redeploy
# Render: Deploys tab → Rollback
# Heroku: heroku releases:rollback
```

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **WhatsApp API**: https://developers.facebook.com/docs/whatsapp
- **Project Architecture**: See `.github/copilot-instructions.md`

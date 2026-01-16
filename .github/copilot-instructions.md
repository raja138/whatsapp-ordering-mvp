# Copilot Instructions - WhatsApp Ordering MVP

## Architecture Overview

This project implements a **WhatsApp-to-Orders pipeline with a tracking dashboard**:

```
WhatsApp Message → Webhook (/webhook) → Order Parser → SQLite DB → Dashboard UI
```

- **Backend**: Node.js Express server receiving WhatsApp webhooks, parsing natural language orders, storing in SQLite
- **Database**: Single-file SQLite (db.sqlite) with `orders` and `deliveries` tables
- **Dashboard**: React TypeScript interface for viewing orders and delivery status
- **Menu**: Static JSON catalog loaded by order parser for item matching

## Key Patterns & Conventions

### Message Processing Pipeline (backend/webhook.js → backend/orders.js)

1. Webhook receives `POST /webhook` with WhatsApp message payload in `entry[].changes[].value.messages`
2. Extract `message.from` (customer ID) and `message.text` (order text)
3. Order parsing uses case-insensitive substring matching against `menu.json` items
4. Store parsed orders in SQLite with `customer_id`, `items` (JSON stringified), and `status`

**Example flow**: `"I want a burger and coke"` → matches items in menu → creates order with status `pending`

### Database Patterns (backend/db.js)

- Use `sqlite3` npm package for asynchronous SQLite access via callbacks
- Initialize schema in `initializeDatabase()` - called once on app startup
- All INSERT/UPDATE use `db.run(sql, params, callback)` pattern
- Order status lifecycle: `pending` → `processing` → `out_for_delivery` → `completed`
- Example: `db.run('INSERT INTO orders (customer_id, items, status) VALUES (?, ?, ?)', [customerId, itemsJSON, 'pending'], callback)`

### Dashboard Architecture (dashboard/pages/index.tsx)

- Single-page React app with two main components:
  - `OrdersList`: displays orders from `/api/orders` endpoint
  - `DeliveryMap`: shows real-time delivery tracking from `/api/deliveries`
- Uses Next.js pages directory structure

## Critical Files & Responsibilities

| File | Purpose |
|------|---------|
| `backend/index.js` | App initialization, middleware setup, API endpoint definitions |
| `backend/webhook.js` | WhatsApp webhook handler, message routing to order parser |
| `backend/orders.js` | Order parsing, menu matching, DB insertion |
| `backend/delivery.js` | Delivery status updates, active order queries |
| `backend/db.js` | Database initialization, schema definition, async wrapper |
| `menu.json` | Single source of truth for menu items (name, price, category) |
| `dashboard/pages/index.tsx` | Main dashboard entry point |

## Development Workflows

### Running the Backend
```bash
npm install        # Installs Express, sqlite3, nodemon
npm start          # Runs backend/index.js on port 3000 (production)
npm run dev        # Runs with nodemon for auto-reload during development
```

### Testing Message Processing
POST to `/webhook` with exact payload structure:
```json
{
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
}
```

**Response**: `{"status":"ok"}` on success, error details on failure

### API Endpoints (for Dashboard Integration)

- `GET /api/orders` - Returns all orders sorted by created_at DESC
- `GET /api/deliveries` - Returns orders with status 'processing' or 'out_for_delivery'
- `PUT /api/orders/:id/status` - Update order status (body: `{"status": "new_status"}`)

### Database Queries Pattern
```javascript
// Read example
db.all('SELECT * FROM orders WHERE status = ?', ['pending'], (err, rows) => {
  if (err) console.error(err);
  console.log(rows);
});

// Write example
db.run('UPDATE orders SET status = ? WHERE id = ?', ['processing', 5], (err) => {
  if (err) console.error(err);
  else console.log('Updated');
});
```

## Cross-Component Integration Points

1. **menu.json ↔ backend/orders.js**: Order parser reads menu items for matching
2. **backend/db.js ↔ backend/orders.js**: Orders module inserts/updates orders via `db.run()`
3. **backend/delivery.js ↔ dashboard**: Status updates flow from delivery module to `/api/deliveries`
4. **WhatsApp API**: Webhook expects incoming message format from Meta's WhatsApp Business API
5. **Dashboard ↔ backend APIs**: React components fetch from `/api/orders` and `/api/deliveries`

## Important Notes for AI Agents

- **No external API calls yet**: Currently uses local SQLite only - deployment will need WhatsApp Business API credentials
- **Order parsing is naive**: Simple case-insensitive substring matching; consider improving with NLP for production
- **Error handling**: Webhook gracefully returns 500 on errors; add logging for debugging
- **Dashboard components not defined**: `OrdersList` and `DeliveryMap` are placeholders - implement with fetches to `/api/orders` and `/api/deliveries` endpoints
- **Async pattern**: Use callbacks with `db.all()`, `db.run()` - not promises
- **Menu matching**: Currently exact substring match; no fuzzy matching or quantity extraction


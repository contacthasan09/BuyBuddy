# API Reference

Base URL: `http://localhost:5000/api`

All responses follow: `{ success: boolean, message: string, data?: any }`

---

## Public

### Products
- `GET /products?page=1&limit=20&search=&category=&sort=newest`
- `GET /products/:slug`

### Categories
- `GET /categories`

### Settings
- `GET /settings`

### Orders
- `POST /orders` — Place guest order (COD)
- `GET /orders/track?invoice=ORD-...&phone=017...`

### Customers
- `POST /customers/lookup` — `{ phone }` → returns name + address for autofill

---

## Admin (JWT required)

Header: `Authorization: Bearer <token>`

### Auth
- `POST /admin/auth/login` — `{ email, password }` → `{ token, admin }`
- `GET /admin/auth/me`

### Products
- `GET /admin/products`
- `GET /admin/products/:id`
- `POST /admin/products`
- `PATCH /admin/products/:id`
- `DELETE /admin/products/:id`

### Categories
- `GET /admin/categories`
- `POST /admin/categories`
- `PATCH /admin/categories/:id`
- `DELETE /admin/categories/:id`

### Orders
- `GET /admin/orders?page=&limit=&status=&search=&from=&to=`
- `GET /admin/orders/:id`
- `PATCH /admin/orders/:id/status` — `{ status, note? }`

### Inventory
- `GET /admin/inventory`
- `GET /admin/inventory/transactions?productId=`
- `GET /admin/inventory/:productId`
- `POST /admin/inventory/add-stock` — `{ productId, quantity, note? }`

### Customers
- `GET /admin/customers`
- `GET /admin/customers/:id`
- `PATCH /admin/customers/:id`

### Shipments (Steadfast)
- `POST /admin/shipments/create` — `{ orderId }` → creates Steadfast consignment
- `GET /admin/shipments/balance` — Steadfast current balance
- `GET /admin/shipments/refresh/:orderId` — manually pull status
- `POST /admin/shipments/returns` — `{ orderId, reason? }`

### Settings
- `GET /admin/settings`
- `PATCH /admin/settings` — bulk upsert `{ key: value, ... }`

---

## Webhooks

### Steadfast
- `POST /webhooks/steadfast` — Auth: `Bearer <STEADFAST_WEBHOOK_TOKEN>`
  - Handles `delivery_status` and `tracking_update`
  - Always returns `200` on processing failure (to prevent retries)
  - Raw payload logged in `webhook_logs`
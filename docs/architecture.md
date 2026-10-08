# Architecture

## Stack
- **Frontend:** Next.js 14 (App Router) + Tailwind + TypeScript (to be wired)
- **Backend:** Node.js + Express + TypeScript + MongoDB (Mongoose)
- **Courier:** Steadfast (multi-provider ready)
- **Events:** Node EventEmitter (in-process) — upgrade to Redis pub/sub later

## Data Flow — Order Lifecycle

1. Customer places order → `POST /api/orders`
2. Backend validates → creates Order (status: PENDING)
3. `ORDER_CREATED` event fires:
   - Inventory: reserve stock (physical stays, reserved += qty)
   - Status history: writes first entry
   - Customer CRM: upsert by phone
4. Admin reviews → `PATCH /admin/orders/:id/status` → CONFIRMED
   - `ORDER_CONFIRMED` event → inventory commit
5. Admin creates shipment → `POST /admin/shipments/create`
   - Calls Steadfast `/create_order`
   - Saves consignment_id + tracking_code
   - Order status → SHIPMENT_CREATED
6. Steadfast delivers → webhook → `POST /api/webhooks/steadfast`
   - Maps Steadfast status → internal status
   - Updates order + payment status
   - Fires `ORDER_DELIVERED` event

## Inventory Model
- **physical** — real units in warehouse
- **reserved** — held for pending orders
- **available** = physical − reserved
- Every change logged in `inventory_transactions` (append-only ledger)

## Status Mapping (Steadfast → Internal)
| Steadfast | Internal |
|-----------|----------|
| in_review | SHIPMENT_CREATED |
| pending | IN_TRANSIT |
| delivered | DELIVERED |
| partial_delivered | DELIVERED |
| cancelled | CANCELLED |
| hold | IN_TRANSIT |
| unknown | IN_TRANSIT |

## Security
- Admin JWT only — no customer auth
- Customer identity = phone (CRM record, not login)
- Steadfast keys server-side only
- Webhook authenticated with `Bearer <token>`
- Rate limits on public order creation
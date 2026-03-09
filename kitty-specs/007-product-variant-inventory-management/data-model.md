# Data Model: Inventory Domain Entities

## ProductVariant (Aggregate Root)
The authoritative entity for stock management.

| Field | Type | Description |
|---|---|---|
| `id` | `SkuId` (String) | Unique identifier for the product variant. |
| `basePrice` | `Money` | Initial price before any discounts. |
| `totalOnHand` | `number` | Physical items available in the warehouse (must be >= 0). |
| `sold` | `number` | Running total of units permanently sold. |
| `reservations` | `StockReservation[]` | Temporary holds on stock. |
| `version` | `number` | Version counter for Optimistic Locking. |

### Invariants
- `totalOnHand >= 0`
- `availableStock = totalOnHand - activeReservationsSum`
- `activeReservationsSum` must not exceed `totalOnHand` on creation.

## StockReservation (Value Object)
Represents a temporary hold on physical stock.

| Field | Type | Description |
|---|---|---|
| `orderId` | `string` | Link to the cart or order initiating the hold. |
| `quantity` | `number` | Number of items held. |
| `expiresAt` | `Date` | Timestamp after which the hold is ignored for `availableStock`. |

---

# Domain Events

## StockReserved
Emitted when `reserve()` succeeds.
- `skuId`: SkuId
- `quantity`: number
- `expiresAt`: Date

## StockDepleted
Emitted when `confirmDepletion()` succeeds (sale completed).
- `skuId`: SkuId
- `quantity`: number

## StockReleased
Emitted when a reservation is manually released or expires.
- `skuId`: SkuId
- `orderId`: string

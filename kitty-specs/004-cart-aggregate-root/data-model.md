# Data Model: Cart Aggregate

## Entities

### Cart (Aggregate Root)
The primary container for the user's shopping session.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | `string` (UUID) | Unique identifier for the anonymous cart. |
| `items` | `Map<string, CartItem>` | Collection of items, keyed by `skuId`. |
| `state` | `CartState` | `Active` \| `Checkout_Pending` \| `Checked_Out` |
| `appliedCoupons` | `string[]` | List of coupon codes applied to this cart. |
| `createdAt` | `Date` | Timestamp of when the cart was created. |
| `updatedAt` | `Date` | Timestamp of the last modification. |

**Invariants:**
- `addItem`: If item exists, increment quantity. Otherwise, creates a new `CartItem`.
- `removeItem`: Removes the entry from the map.
- `changeQuantity`: Updates existing item; throws if qty < 1.
- `subtotal`: Calculated as `∑ (item.priceAtAddition * item.quantity)`.
- `initiateCheckout`: Allowed only if `Active` and `items.size > 0`.
- `markCheckedOut`: Allowed only if `Checkout_Pending`.

---

### CartItem (Entity)
A specific product selection within a cart.

| Attribute | Type | Description |
|-----------|------|-------------|
| `skuId` | `string` | Unique identifier for the product variant. |
| `quantity` | `number` | Must be ≥ 1. |
| `priceAtAddition` | `Money` | The unit price when the item was first added. |

**Calculated Properties:**
- `total`: `priceAtAddition.multiply(quantity)`

---

## Domain Events

### ItemAddedToCart
- `cartId`: string
- `skuId`: string
- `quantity`: number
- `price`: Money

### CartItemQuantityChanged
- `cartId`: string
- `skuId`: string
- `oldQuantity`: number
- `newQuantity`: number

### ItemRemovedFromCart
- `cartId`: string
- `skuId`: string

### CartCleared
- `cartId`: string

### CheckoutInitiated
- `cartId`: string

### CartCheckedOut
- `cartId`: string

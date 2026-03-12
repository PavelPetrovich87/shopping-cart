# Data Model: Cart Use Cases
*Path: kitty-specs/010-cart-use-cases/data-model.md*

## Domain Events (New)

### `CouponAppliedToCart`
- **Fields**:
  - `cartId: string`
  - `code: string`
  - `discountAmount?: Money`
  - `discountPercentage?: number`

### `CouponRemovedFromCart`
- **Fields**:
  - `cartId: string`
  - `code: string`

### `CheckoutInitiated`
- **Fields**:
  - `cartId: string`
  - `items: { skuId: string, quantity: number }[]`
  - `subtotal: Money`

## Use Case Payload Structures

### Use Case Return Type
```typescript
type UseCaseResult = Result<{
  updatedCart: Cart;
  events: DomainEvent[];
}, string>;
```

### `AddItemToCart` Input
- `cartId: string`
- `skuId: string`
- `quantity: number`
- `price: Money`

### `RemoveItemFromCart` Input
- `cartId: string`
- `skuId: string`

### `ChangeCartItemQuantity` Input
- `cartId: string`
- `skuId: string`
- `newQuantity: number`

### `ApplyCouponToCart` Input
- `cartId: string`
- `code: string`

### `RemoveCouponFromCart` Input
- `cartId: string`
- `code: string`

### `InitiateCheckout` Input
- `cartId: string`

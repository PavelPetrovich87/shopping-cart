# Quickstart: Validating Cart Ports

## Use Case Integration Scenarios

### Scenario 1: Adding Item to Cart
1. `AddItemToCart` use case receives `skuId` and `quantity`.
2. Calls `IInventoryService.checkStockAvailability(skuId, quantity)`.
3. **Switch on Result**:
    - If `success: true` and `available: true`: Proceed to add item.
    - If `success: true` and `available: false`: Show "Insufficient stock" message.
    - If `success: false` and `error: 'INVALID_SKU'`: Return domain error to UI.

### Scenario 2: Applying a Coupon
1. `ApplyCouponToCart` use case receives `code` and `subtotal`.
2. Calls `IPricingService.validateCoupon(code)`.
3. **Check Validity**:
    - If `success: true`: Call `IPricingService.calculateDiscount(code, subtotal)`.
    - If `success: false`: Return the specific domain error (e.g., "This coupon doesn't exist").

### Scenario 3: Persisting the Cart
1. After any mutation, use case calls `ICartRepository.saveCart(cart)`.
2. The UI can then immediately reflect the change via the reactive store (Zustand).

## Port Interface Drafts (Conceptual)

```typescript
// src/features/cart/application/ports/ICartRepository.ts
export interface ICartRepository {
  getCart(id: string): Cart;
  saveCart(cart: Cart): void;
}

// src/features/cart/application/ports/IInventoryService.ts
export interface IInventoryService {
  checkStockAvailability(skuId: string, quantity: number): Promise<StockResult>;
}

// src/features/cart/application/ports/IPricingService.ts
export interface IPricingService {
  validateCoupon(code: string): Promise<CouponResult>;
  calculateDiscount(code: string, subtotal: Money): Promise<MoneyResult>;
}
```

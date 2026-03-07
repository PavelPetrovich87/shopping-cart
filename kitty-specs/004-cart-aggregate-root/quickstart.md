# Quickstart: Cart Aggregate Root

## Overview
This feature implements the core logic for the shopping cart. It is a pure domain implementation, meaning it contains no external dependencies other than the `Money` Value Object.

## Key Files
- `src/features/cart/domain/Cart.ts`: The Aggregate Root.
- `src/features/cart/domain/CartItem.ts`: Key entity for items.
- `src/features/cart/domain/events/`: Directory containing domain event definitions.

## Basic Usage

### Creating a Cart
```typescript
const cart = new Cart(crypto.randomUUID());
```

### Adding an Item
```typescript
const item = new CartItem(skuId, quantity, priceAtAddition);
cart.addItem(item);
```

### Lifecycle
```typescript
cart.initiateCheckout(); // Transitions to Checkout_Pending
cart.markCheckedOut();   // Transitions to Checked_Out
```

## Running Tests
Once implemented, you can run unit tests using:
```bash
npm test src/features/cart/domain/
```

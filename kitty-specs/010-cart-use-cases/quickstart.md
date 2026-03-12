# Quickstart: Cart Use Cases
*Path: kitty-specs/010-cart-use-cases/quickstart.md*

## Usage Example

```typescript
import { addItemToCart } from '@/features/cart/application/use-cases/AddItemToCart';
import { Money } from '@/shared/domain/Money';

const result = await addItemToCart(
  { 
    cartId: 'cart-123', 
    skuId: 'variant-456', 
    quantity: 2, 
    price: Money.fromCents(1000) 
  },
  { cartRepository, inventoryService, pricingService }
);

if (result.success) {
  const { updatedCart, events } = result.value;
  
  // Caller handles side effects
  await cartRepository.save(updatedCart);
  events.forEach(e => eventBus.publish(e));
  
  console.log('Item added successfully');
} else {
  console.error('Failed to add item:', result.error);
}
```

## Running Tests

```bash
npm run test tests/unit/features/cart/application/use-cases/
```

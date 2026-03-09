# ICartRepository

**Purpose**: Contract for persisting and retrieving the Cart aggregate.

```typescript
import { Cart } from '@/features/cart/domain/Cart';

export interface ICartRepository {
  /**
   * Retrieves a Cart by its unique identifier.
   * Implementation is synchronous as it's backed by local state.
   */
  getCart(id: string): Cart;

  /**
   * Persists the current state of the Cart.
   */
  saveCart(cart: Cart): void;
}
```

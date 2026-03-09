# IInventoryService

**Purpose**: Port for communicating with the Inventory domain context.

```typescript
import { StockResult } from '@/features/cart/domain/StockResult';

export interface IInventoryService {
  /**
   * Checks if a specific quantity of a product variant is available in stock.
   */
  checkStockAvailability(skuId: string, quantity: number): Promise<StockResult>;
}
```

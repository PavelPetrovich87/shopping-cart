# ICalculateDiscount

```typescript
import { Money } from '@/shared/domain/Money';
import { MoneyResult } from '@/features/cart/domain/PricingResults';

/**
 * Inbound port for calculating the discount for a given code and subtotal.
 */
export type CalculateDiscount = (code: string, subtotal: Money) => Promise<MoneyResult>;
```

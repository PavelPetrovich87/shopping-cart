# IPricingService

**Purpose**: Port for communicating with the Pricing domain context.

```typescript
import { Money } from '@/shared/domain/Money';
import { CouponResult } from '@/features/cart/domain/CouponResult';
import { MoneyResult } from '@/features/cart/domain/MoneyResult';

export interface IPricingService {
  /**
   * Validates if a coupon code is applicable.
   */
  validateCoupon(code: string): Promise<CouponResult>;

  /**
   * Calculates the discount amount for a given code and subtotal.
   */
  calculateDiscount(code: string, subtotal: Money): Promise<MoneyResult>;
}
```

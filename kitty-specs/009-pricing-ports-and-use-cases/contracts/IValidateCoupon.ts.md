# IValidateCoupon

```typescript
import { CouponResult } from '@/features/cart/domain/PricingResults';

/**
 * Inbound port for validating a coupon code.
 */
export type ValidateCoupon = (code: string) => Promise<CouponResult>;
```

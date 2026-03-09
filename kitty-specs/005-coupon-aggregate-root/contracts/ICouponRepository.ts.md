# Contract: ICouponRepository

## Repository Interface

The `ICouponRepository` interface defines the driven port for accessing `Coupon` persistence.

### Interface: `ICouponRepository`

```typescript
import { Coupon } from '../domain/Coupon';

export interface ICouponRepository {
  /**
   * Retrieves a coupon by its unique code.
   * Returns null if the coupon is not found.
   * @param code The unique alphanumeric coupon code.
   */
  findByCode(code: string): Promise<Coupon | null>;

  /**
   * Saves a new or updated coupon aggregate.
   * @param coupon The coupon aggregate to persist.
   */
  save(coupon: Coupon): Promise<void>;

  /**
   * Retrieves all available coupons.
   * (Optional, but often used for back-office or listing)
   */
  findAll(): Promise<Coupon[]>;
}
```

### Domain Errors
- `CouponNotFoundError`: Thrown when a lookup for a specific code fails if existence is expected.
- `InvalidCouponDataError`: Thrown during loading if data from source fails Zod validation.

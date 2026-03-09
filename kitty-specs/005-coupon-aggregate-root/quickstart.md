# Quickstart: Coupon Aggregate Root

## Usage Examples

### Initializing a Percentage Coupon

```typescript
import { Coupon } from './domain/Coupon';
import { Money } from '@/shared/domain/Money';

const tenPercentOff = Coupon.create({
  code: "SAVE10",
  discountType: 'PERCENTAGE',
  discountValue: 10,
  expirationDate: new Date('2026-12-31'),
});
```

### Calculating a Discount

```typescript
const subtotal = Money.fromPrice(100);
const { discount, events } = tenPercentOff.calculateDiscount(subtotal);

console.log(discount.format()); // "$10.00"
// events will contain DiscountCalculatedDomainEvent
```

### Validating an Expired Coupon

```typescript
const expiredCoupon = Coupon.create({
  code: "OLD_CODE",
  discountType: 'FLAT',
  discountValue: 500, // $5.00
  expirationDate: new Date('2020-01-01'),
});

const { isValid, error } = expiredCoupon.validate({ currentDate: new Date() });

if (!isValid) {
  console.error(error); // "Sorry, but this coupon has expired"
}
```

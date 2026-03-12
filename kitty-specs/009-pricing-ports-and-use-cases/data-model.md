# Data Model: 009-pricing-ports-and-use-cases

## Use Case Inputs/Outputs

### 1. ValidateCoupon
- **Input**: `code` (string)
- **Output**: `CouponResult` (type alias from `src/features/cart/domain/PricingResults.ts`)
  - `success: true, value: { code, discount_amount?, discount_percentage? }`
  - `success: false, error: CouponError`

### 2. CalculateDiscount
- **Input**:
  - `code` (string)
  - `subtotal` (`Money` Value Object)
- **Output**: `MoneyResult` (type alias from `src/features/cart/domain/PricingResults.ts`)
  - `success: true, value: Money` (The calculated discount amount)
  - `success: false, error: MoneyError`

## Repository Contracts (Port)

### ICouponRepository
- `findByCode(code: string): Promise<Coupon | null>`
- `save(coupon: Coupon): Promise<void>`
- `findAll(): Promise<Coupon[]>`

## Domain Types (Leveraged)

### Coupon (Aggregate Root)
- `code: string`
- `isValid(): boolean`
- `calculateDiscount(subtotal: Money): Money`

### Money (Value Object)
- `amount: number` (cents)
- `currency: string`
- `add(other: Money): Money`
- `subtract(other: Money): Money`
- `isNegative(): boolean`

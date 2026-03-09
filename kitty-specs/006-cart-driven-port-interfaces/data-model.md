# Data Model: Cart Driven Port Interfaces

## Shared Domain Wrapper

### `Result<T, E>`
- **success**: `boolean` (True if operation succeeded)
- **value**: `T` (Present only if success is true)
- **error**: `E` (Present only if success is false)

## Feature-Specific Results (Domain Layer)

### `StockResult` (Inventory Context)
- **Success Value**: `{ available: boolean, currentStock: number }`
- **Error Codes**:
    - `INVALID_SKU`: The provided SKU ID does not exist.
    - `OUT_OF_STOCK`: Requested quantity exceeds available stock.
    - `INSUFFICIENT_STOCK`: Partial stock available but less than requested.

### `CouponResult` (Pricing Context)
- **Success Value**: `{ code: string, discount_amount?: Money, discount_percentage?: number }`
- **Error Codes**:
    - `INVALID_CODE`: "Please enter a valid code"
    - `EXPIRED`: "This coupon has expired"
    - `COUPON_NOT_FOUND`: "Sorry, but this coupon doesn't exist"

### `MoneyResult` (Pricing Context)
- **Success Value**: `Money`
- **Error Codes**:
    - `NEGATIVE_TOTAL`: The discount would result in a negative total (should be capped).
    - `CALCULATION_FAILURE`: Error during arithmetic operations.

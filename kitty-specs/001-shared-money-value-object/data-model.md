# Data Model: Money Value Object

## Entity: Money (Value Object)

### Fields
- `cents` (private, readonly): `number` - The amount represented in integer cents.

### Methods
- `static fromCents(cents: number): Money`
- `static fromPrice(price: number): Money` (Converts float/decimal price to cents)
- `add(other: Money): Money`
- `subtract(other: Money): Money`
- `multiply(factor: number): Money`
- `equals(other: Money): boolean`
- `format(locale?: string): string` (Returns USD formatted string)

### Validation Rules
- `cents` must be an integer.
- `multiply` should handle rounding if necessary (e.g., for percentage-based discounts).

### State Transitions
- N/A (Immutable Value Object)

# Data Model: Coupon Aggregate Root

## Entity: Coupon (Aggregate Root)

The `Coupon` entity represents a specific promotional offer.

### Fields
- **code** (`string`): Unique identifier (e.g., "SAVE10"). Must be alphanumeric.
- **discountType** (`'FLAT' | 'PERCENTAGE'`): The calculation mode.
- **discountValue** (`number`): 
  - If `FLAT`: Represented as integer cents (or uses `Money`).
  - If `PERCENTAGE`: Represented as a percentage (e.g., `10` for 10%).
- **status** (`'ACTIVE' | 'INACTIVE'`): Manual toggle for the coupon's availability.
- **expirationDate** (`Date | null`): Optional end date for the coupon's validity.

### Invariants (Enforced via Zod)
- `code` must not be empty.
- `discountValue` must be positive.
- If `PERCENTAGE`, `discountValue` must be between 1 and 100.
- A `Coupon` cannot calculate a discount if its status is `INACTIVE` or if current date > `expirationDate`.
- The calculated discount must never exceed the provided subtotal.

### State Transitions
- **Deactivate**: Change status from `ACTIVE` to `INACTIVE`.
- **Activate**: Change status from `INACTIVE` to `ACTIVE`.

### Methods
- `calculateDiscount(subtotal: Money): { discount: Money, events: DomainEvent[] }`
- `validate(context: { currentDate: Date }): { isValid: boolean, error?: string, events: DomainEvent[] }`

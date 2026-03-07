# Feature Specification: Cart Aggregate Root

## User Stories

## Functional Requirements

- [ ] `FR-001`: Add item to cart (increments quantity if exists).
- [ ] `FR-002`: Remove item from cart.
- [ ] `FR-003`: Change item quantity (must be >= 1).
- [ ] `FR-004`: Subtotal is calculated accurately using `Money` value object.
- [ ] `FR-005`: Support multiple applied coupons.
- [ ] `FR-006`: Remove applied coupons.
- [ ] `FR-007`: Initial state is `Active`.
- [ ] `FR-008`: Transition to `Checkout_Pending` when checkout is initiated.
- [ ] `FR-009`: Transition to `Checked_Out` when checkout is complete.

## Success Criteria
- [ ] Cart aggregate correctly manages `CartItem` entities.
- [ ] All mutations emit appropriate domain events (`ItemAddedToCart`, etc.).
- [ ] Invariants (quantity >= 1) are strictly enforced.

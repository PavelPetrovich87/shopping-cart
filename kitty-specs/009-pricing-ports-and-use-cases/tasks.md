# Tasks: 009-pricing-ports-and-use-cases

## Work Packages

### WP01: Ports and Results Foundations
**Goal**: Establish the structural foundations and result types for the Pricing context.
**Priority**: P0
**Success Criteria**: Result types and port interfaces are defined and correctly imported by other contexts.
**Estimated Prompt Size**: ~350 lines

- [x] T001: Move `PricingResults.ts` from `src/features/cart/domain/` to `src/features/pricing/domain/` and update all references. [P]
- [x] T002: Create Inbound Port `IValidateCoupon.ts` in `src/features/pricing/application/ports/IValidateCoupon.ts` based on the design contract. [P]
- [x] T003: Create Inbound Port `ICalculateDiscount.ts` in `src/features/pricing/application/ports/ICalculateDiscount.ts` based on the design contract. [P]
- [x] T004: Update driven port `src/features/cart/application/ports/IPricingService.ts` to use the new `PricingResults` from the `pricing` domain. [P]
- [x] T005: Create a barrel file for ports in `src/features/pricing/application/ports/index.ts`. [P]

**Implementation Sketch**:
1. Copy `src/features/cart/domain/PricingResults.ts` to `src/features/pricing/domain/PricingResults.ts`.
2. Delete original `src/features/cart/domain/PricingResults.ts`.
3. Update `src/features/cart/application/ports/IPricingService.ts` imports.
4. Define the port interfaces for the Pricing context as functional types.

---

### WP02: Validate Coupon Use Case
**Goal**: Implement the business logic for coupon validation.
**Priority**: P1
**Success Criteria**: `ValidateCoupon` use case returns correct success/failure results based on repository lookups and aggregate status.
**Estimated Prompt Size**: ~400 lines
**Dependencies**: ["WP01"]

- [x] T006: Implement `ValidateCoupon` standalone function in `src/features/pricing/application/use-cases/ValidateCoupon.ts`.
- [x] T007: Implement unit tests for `ValidateCoupon` in `src/features/pricing/application/use-cases/__tests__/ValidateCoupon.spec.ts`.
- [x] T008: Verify correct domain event generation during validation via mocks/spies.

**Implementation Sketch**:
1. Create a factory function `createValidateCoupon` that takes `ICouponRepository` as a dependency.
2. Return an async function that implements the logic: lookup coupon → validate aggregate → return result.
3. Write exhaustive unit tests for all scenarios (empty code, code not found, invalid coupon, success).

---

### WP03: Calculate Discount Use Case
**Goal**: Implement the business logic for calculating coupon discounts.
**Priority**: P1
**Success Criteria**: `CalculateDiscount` use case correctly applies flat and percentage discounts via the `Coupon` aggregate.
**Estimated Prompt Size**: ~400 lines
**Dependencies**: ["WP01"]

- [x] T009: Implement `CalculateDiscount` standalone function in `src/features/pricing/application/use-cases/CalculateDiscount.ts`.
- [x] T010: Implement unit tests for `CalculateDiscount` in `src/features/pricing/application/use-cases/__tests__/CalculateDiscount.spec.ts`.
- [x] T011: Verify correct discount calculation and domain event emission for both FLAT and PERCENTAGE types.

**Implementation Sketch**:
1. Create a factory function `createCalculateDiscount` that takes `ICouponRepository` as a dependency.
2. Return an async function that implements the logic: lookup coupon → delegate math to aggregate → return result.
3. Write unit tests for different discount types and edge cases (e.g., discount > subtotal).

---

### WP04: Composition Root and Context Initialisation
**Goal**: Wire the Pricing context using Pure DI.
**Priority**: P2
**Success Criteria**: All use cases are initialized with their dependencies and exported for use by other contexts.
**Estimated Prompt Size**: ~250 lines
**Dependencies**: ["WP02", "WP03"]

- [x] T012: Create `src/features/pricing/infrastructure/PricingContext.ts` to wire repositories to use cases.
- [x] T013: Export initialized use cases from the context for use by other contexts.

**Implementation Sketch**:
1. Create the `infrastructure` directory in the `pricing` context.
2. Define a `createPricingContext` or similar setup function that instantiates the in-memory repository.
3. Initialize the use cases with the repository instance.
4. Export the resulting object containing the use case implementations.

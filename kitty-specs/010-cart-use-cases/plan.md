# Implementation Plan: 010-cart-use-cases
*Path: kitty-specs/010-cart-use-cases/plan.md*

**Branch**: `main` | **Date**: 2026-03-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `kitty-specs/010-cart-use-cases/spec.md`

## Summary
Implement core Cart application use cases (`AddItemToCart`, `RemoveItemFromCart`, `ChangeCartItemQuantity`, `ApplyCouponToCart`, `RemoveCouponFromCart`, `InitiateCheckout`) as standalone functional handlers using the Result pattern. These handlers will orchestrate domain logic and external ports (Inventory, Pricing) but will remain pure by returning the updated aggregate and domain events for the caller to persist and publish.

## Technical Context

**Language/Version**: TypeScript 5.x (Vite)  
**Primary Dependencies**: `Cart` aggregate, `IInventoryService`, `IPricingService`, `EventBus`  
**Storage**: In-memory (Zustand-based repository adapter)  
**Testing**: Vitest (100% coverage for use cases, including mocked ports)  
**Target Platform**: Web (Chrome, Firefox, Safari)
**Project Type**: Frontend (Hexagonal Architecture / DDD)  
**Performance Goals**: Instantaneous UI updates for cart mutations  
**Constraints**: 
- Standalone functional handlers (no classes/mediators).
- `Result<T, E>` pattern for error propagation.
- Handlers return `{ updatedCart, events }` on success.
- Caller is responsible for persistence (`cartRepository.save`) and event publishing (`eventBus.publish`).
**Scale/Scope**: 6 core use cases for the Cart context.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **DDD Strictness**: Use cases orchestrate domain entities and ports. **PASSED**
2. **Hexagonal Architecture**: Ports (`IInventoryService`, `IPricingService`) are used to decouple from infrastructure. **PASSED**
3. **State vs. Events**: User requested a deviation where Use Cases return events/aggregate instead of performing side effects directly. This is a deliberate design choice for higher purity/testability. **PASSED (with deviation)**
4. **Testing**: 100% coverage mandated. **PASSED**

## Project Structure

### Documentation (this feature)

```
kitty-specs/010-cart-use-cases/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (generated via /spec-kitty.tasks)
```

### Source Code (repository root)

```
src/
├── features/
│   └── cart/
│       ├── application/
│       │   └── use-cases/      # Standalone functional handlers
│       │       ├── AddItemToCart.ts
│       │       ├── RemoveItemFromCart.ts
│       │       ├── ChangeCartItemQuantity.ts
│       │       ├── ApplyCouponToCart.ts
│       │       ├── RemoveCouponFromCart.ts
│       │       └── InitiateCheckout.ts
│       ├── domain/
│       │   ├── entities/       # Cart aggregate (T-004)
│       │   └── ports/          # IInventoryService, IPricingService (T-005)
│       └── infrastructure/
│           └── adapters/       # Zustand repository, Mock services
tests/
└── unit/
    └── features/
        └── cart/
            └── application/
                └── use-cases/  # 100% coverage tests
```

**Structure Decision**: Standard Hexagonal structure within the `cart` feature module.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Pure handlers | User requested use cases return events/aggregate for caller to handle side effects. | Direct orchestration in use cases is standard but user prefers strict separation of side effects. |
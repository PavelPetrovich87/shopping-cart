# Research: Cart Driven Port Interfaces

## Decision: Generic Result Wrapper

**Chosen**: Discriminated Union interface/type in `src/shared/domain/Result.ts`.

**Rationale**:
- **Type Safety**: TypeScript excels at narrowing types when using a discriminant like `success: boolean` or `ok: boolean`.
- **Zero Runtime Overhead**: Using plain objects/types avoids the need for a full class implementation while maintaining high performance.
- **Interoperability**: Simple object shapes are easy to serialize/deserialize if these results ever need to cross the wire (though they are domain objects).

**Structure**:
```typescript
export type Result<T, E = string> = 
  | { success: true; value: T }
  | { success: false; error: E };
```

---

## Decision: Domain-Specific Results

**Chosen**: Specialized `type` aliases for specific business outcomes.

**Rationale**:
- Provides clarity in the Application layer.
- Enforces specific error codes (enums or string literals) instead of generic strings.

**Outcomes**:
- `StockResult`: `Result<{ available: boolean; currentStock: number }, 'OUT_OF_STOCK' | 'INVALID_SKU'>`
- `CouponResult`: `Result<{ code: string; discount_amount?: Money; discount_percentage?: number }, 'INVALID_CODE' | 'EXPIRED' | 'MIN_SUBTOTAL_NOT_MET'>`
- `MoneyResult`: `Result<Money, 'CALCULATION_ERROR' | 'NEGATIVE_RESULT'>`

---

## Alternatives Considered

1. **`neverthrow` library**:
   - *Pros*: Robust, includes utility functions like `map`, `andThen`.
   - *Cons*: Adds a runtime dependency; might be overkill for a learning project where the goal is to understand the mechanics of DDD.
   
2. **Standard Exception Handling**:
   - *Pros*: Built into the language.
   - *Cons*: `try/catch` is non-exhaustive and opaque in function signatures; business-level "failures" (like out of stock) are not exceptional and should be part of the happy-path domain logic.

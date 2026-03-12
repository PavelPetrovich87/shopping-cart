# Quickstart: 009-pricing-ports-and-use-cases

## Implementation Flow

1. **Inbound Ports**: Define the functional types for the use cases in `src/features/pricing/application/ports/`.
2. **Use Case Factories**: Create the implementation functions in `src/features/pricing/application/use-cases/`.
3. **Pure DI**: Instantiate and inject the `ICouponRepository` into the use case factories at the composition root (or test setup).

## Usage Example

```typescript
// src/features/pricing/application/use-cases/ValidateCoupon.ts
import { ICouponRepository } from '../../domain/ports/ICouponRepository';
import { ValidateCoupon } from '../ports/IValidateCoupon';

export const createValidateCoupon = (repository: ICouponRepository): ValidateCoupon => {
  return async (code: string) => {
    if (!code) return { success: false, error: 'INVALID_CODE' };
    
    const coupon = await repository.findByCode(code);
    if (!coupon) return { success: false, error: 'COUPON_NOT_FOUND' };

    return { 
      success: true, 
      value: { 
        code: coupon.code,
        // ... details from coupon aggregate
      } 
    };
  };
};
```

## Testing Strategy

- **Unit Tests**: Mock `ICouponRepository` to verify all domain error scenarios (not found, malformed code).
- **Integration Tests**: Verify the factory correctly wires the repository and the closure maintains state/access.

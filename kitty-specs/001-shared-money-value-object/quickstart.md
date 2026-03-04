# Quickstart: Money Value Object

## Usage Example

```typescript
import { Money } from '@/shared/domain/Money';

const price = Money.fromPrice(25.99);
const tax = price.multiply(0.07); // 7% tax
const total = price.add(tax);

console.log(total.format()); // "$27.81"
```

## Running Tests
```bash
npx vitest src/shared/domain/__tests__/Money.spec.ts
```

# Research: Money Value Object Implementation

## Decision: Intl.NumberFormat for USD Formatting
**Rationale**: `Intl.NumberFormat` is a built-in, robust API in modern browsers and Node.js for locale-aware number formatting. It correctly handles currency symbols, decimal separators, and grouping (commas) based on the locale.

**Alternatives Considered**:
- **Manual String Formatting**: Rejected as it's error-prone and doesn't handle internationalization well if the project scales beyond USD.
- **External Libraries (e.g., accounting.js)**: Rejected to keep dependencies minimal for a simple Value Object.

## Decision: Integer Cents for Storage
**Rationale**: Standard practice for financial applications to avoid IEEE 754 floating-point rounding errors (e.g., `0.1 + 0.2 !== 0.3`).

**Alternatives Considered**:
- **BigInt**: Possible, but standard `number` can safely represent up to $90 trillion in cents (Number.MAX_SAFE_INTEGER is ~9 quadrillion), which is sufficient for a shopping cart.
- **BigDecimal libraries**: Overkill for this scope.

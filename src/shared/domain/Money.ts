/**
 * Money Value Object
 * Handles monetary values as integer cents to avoid floating-point errors.
 * Immutable: All operations return a new Money instance.
 */
export class Money {
    private readonly cents: number;

    protected constructor(cents: number) {
        if (!Number.isInteger(cents)) {
            throw new Error(`Money cents must be an integer: ${cents}`);
        }
        this.cents = cents;
    }

    /**
     * Factory method: Create Money from raw integer cents.
     */
    public static fromCents(cents: number): Money {
        return new Money(cents);
    }

    /**
     * Factory method: Create Money from a float/decimal price (e.g., 25.99).
     */
    public static fromPrice(price: number): Money {
        return new Money(Math.round(price * 100));
    }

    /**
     * Addition
     */
    public add(other: Money): Money {
        return new Money(this.cents + other.cents);
    }

    /**
     * Subtraction
     */
    public subtract(other: Money): Money {
        return new Money(this.cents - other.cents);
    }

    /**
     * Multiplication (for discounts, tax, etc.)
     */
    public multiply(factor: number): Money {
        return new Money(Math.round(this.cents * factor));
    }

    /**
     * Equality check
     */
    public equals(other: Money): boolean {
        return this.cents === other.cents;
    }

    /**
     * Locale-aware formatting (USD by default)
     */
    public format(locale: string = 'en-US'): string {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'USD',
        }).format(this.cents / 100);
    }

    /**
     * Helper to get raw cents (useful for serialization or storage)
     */
    public get rawCents(): number {
        return this.cents;
    }
}

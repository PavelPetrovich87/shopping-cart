import { describe, it, expect } from 'vitest';
import { Money } from '../Money';

describe('Money Value Object', () => {
    describe('Factory Methods', () => {
        it('should create from cents', () => {
            const money = Money.fromCents(100);
            expect(money.rawCents).toBe(100);
        });

        it('should create from price', () => {
            const money = Money.fromPrice(25.99);
            expect(money.rawCents).toBe(2599);
        });

        it('should round correctly when creating from price', () => {
            const money = Money.fromPrice(25.999);
            expect(money.rawCents).toBe(2600);
        });

        it('should throw error if cents is not an integer', () => {
            expect(() => Money.fromCents(100.5)).toThrow('Money cents must be an integer');
        });
    });

    describe('Arithmetic Operations', () => {
        it('should add money', () => {
            const m1 = Money.fromCents(100);
            const m2 = Money.fromCents(50);
            const result = m1.add(m2);
            expect(result.rawCents).toBe(150);
            expect(result).not.toBe(m1);
            expect(result).not.toBe(m2);
        });

        it('should subtract money', () => {
            const m1 = Money.fromCents(100);
            const m2 = Money.fromCents(30);
            const result = m1.subtract(m2);
            expect(result.rawCents).toBe(70);
        });

        it('should multiply money and round correctly', () => {
            const m1 = Money.fromCents(100);
            const result = m1.multiply(1.075); // 7.5% tax
            expect(result.rawCents).toBe(108);
        });

        it('should maintain immutability', () => {
            const m1 = Money.fromCents(100);
            m1.add(Money.fromCents(50));
            expect(m1.rawCents).toBe(100);
        });
    });

    describe('Comparison', () => {
        it('should check for equality', () => {
            const m1 = Money.fromCents(100);
            const m2 = Money.fromCents(100);
            const m3 = Money.fromCents(200);
            expect(m1.equals(m2)).toBe(true);
            expect(m1.equals(m3)).toBe(false);
        });
    });

    describe('Formatting', () => {
        it('should format as USD by default', () => {
            const money = Money.fromCents(123456);
            // Using regex for flexibility with space/non-breaking space in different environments
            expect(money.format()).toMatch(/\$1,234\.56/);
        });

        it('should handle zero value formatting', () => {
            const money = Money.fromCents(0);
            expect(money.format()).toMatch(/\$0\.00/);
        });

        it('should handle negative value formatting', () => {
            const money = Money.fromCents(-100);
            expect(money.format()).toMatch(/-\$1\.00/);
        });
    });
});

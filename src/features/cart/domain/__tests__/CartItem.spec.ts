import { describe, it, expect } from 'vitest';
import { CartItem } from '../CartItem';
import { Money } from '@/shared/domain/Money';

describe('CartItem', () => {
    const mockPrice = Money.fromPrice(10); // $10.00

    it('should create a valid CartItem', () => {
        const item = new CartItem('sku-123', 2, mockPrice);
        expect(item.skuId).toBe('sku-123');
        expect(item.quantity).toBe(2);
        expect(item.priceAtAddition).toBe(mockPrice);
    });

    it('should throw an error if quantity is less than 1', () => {
        expect(() => new CartItem('sku-123', 0, mockPrice)).toThrow('CartItem quantity must be at least 1');
        expect(() => new CartItem('sku-123', -5, mockPrice)).toThrow('CartItem quantity must be at least 1');
    });

    it('should calculate total correctly', () => {
        const item = new CartItem('sku-123', 3, mockPrice);
        const total = item.total();
        expect(total.rawCents).toBe(3000); // 3 * $10.00 (1000 cents) = 3000 cents
    });
});

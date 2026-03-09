import { describe, it, expect, beforeEach } from 'vitest';
import { ProductVariant } from '../ProductVariant';
import { StockReservation } from '../StockReservation';

describe('ProductVariant', () => {
  const skuId = 'sku-123';
  const totalOnHand = 100;
  let variant: ProductVariant;

  beforeEach(() => {
    variant = new ProductVariant(skuId, totalOnHand);
  });

  it('should initialize with correct values', () => {
    expect(variant.id).toBe(skuId);
    expect(variant.totalOnHand).toBe(totalOnHand);
    expect(variant.sold).toBe(0);
    expect(variant.reservations).toEqual([]);
  });

  it('should throw if totalOnHand is negative', () => {
    expect(() => new ProductVariant(skuId, -1)).toThrow('ProductVariant totalOnHand cannot be negative');
  });

  it('should throw if sold is negative', () => {
    expect(() => new ProductVariant(skuId, 100, -1)).toThrow('ProductVariant sold cannot be negative');
  });

  describe('availableStock', () => {
    it('should return totalOnHand if there are no reservations', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      expect(variant.availableStock(now)).toBe(totalOnHand);
    });

    it('should subtract active reservations from availableStock', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      const expiry = new Date('2026-03-09T12:15:00Z');
      const res = new StockReservation('order-1', 10, expiry);

      // Using any to push reservation for testing T003 without reserve() method from WP02
      (variant as any)._reservations.push(res);

      expect(variant.availableStock(now)).toBe(90);
    });

    it('should ignore expired reservations', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      const expired = new Date('2026-03-09T11:59:59Z');
      const res = new StockReservation('order-1', 10, expired);

      (variant as any)._reservations.push(res);

      expect(variant.availableStock(now)).toBe(100);
    });

    it('should only include reservations where expiresAt is strictly after now', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      const exactlyNow = new Date('2026-03-09T12:00:00Z');
      const res = new StockReservation('order-1', 10, exactlyNow);

      (variant as any)._reservations.push(res);

      expect(variant.availableStock(now)).toBe(100);
    });

    it('should sum multiple active reservations', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      const res1 = new StockReservation('order-1', 10, new Date('2026-03-09T12:05:00Z'));
      const res2 = new StockReservation('order-2', 20, new Date('2026-03-09T12:10:00Z'));
      const res3 = new StockReservation('order-3', 5, new Date('2026-03-09T11:55:00Z')); // Expired

      (variant as any)._reservations.push(res1, res2, res3);

      expect(variant.availableStock(now)).toBe(70); // 100 - (10 + 20)
    });

    it('should never return less than zero availableStock (guard against logical errors)', () => {
       // This shouldn't happen with proper reserve() implementation, 
       // but testing the robustness of availableStock getter.
      const now = new Date('2026-03-09T12:00:00Z');
      const hugeRes = new StockReservation('order-1', 150, new Date('2026-03-09T12:15:00Z'));
      
      (variant as any)._reservations.push(hugeRes);

      expect(variant.availableStock(now)).toBe(0);
    });
  });
});

describe('StockReservation', () => {
  it('should initialize and validate quantity', () => {
    const expiresAt = new Date();
    const res = new StockReservation('order-1', 10, expiresAt);
    expect(res.orderId).toBe('order-1');
    expect(res.quantity).toBe(10);
    expect(res.expiresAt.getTime()).toBe(expiresAt.getTime());
  });

  it('should throw if quantity is <= 0', () => {
    const expiresAt = new Date();
    expect(() => new StockReservation('order-1', 0, expiresAt)).toThrow('StockReservation quantity must be greater than zero');
    expect(() => new StockReservation('order-1', -1, expiresAt)).toThrow('StockReservation quantity must be greater than zero');
  });

  it('should implement equality check', () => {
    const date1 = new Date('2026-03-09T12:00:00Z');
    const date2 = new Date('2026-03-09T12:00:00Z');
    const res1 = new StockReservation('order-1', 10, date1);
    const res2 = new StockReservation('order-1', 10, date2);
    const res3 = new StockReservation('order-2', 10, date1);

    expect(res1.equals(res2)).toBe(true);
    expect(res1.equals(res3)).toBe(false);
  });

  it('should maintain immutability via defensive copies', () => {
    const expiresAt = new Date('2026-03-09T12:00:00Z');
    const res = new StockReservation('order-1', 10, expiresAt);

    expiresAt.setFullYear(2030);
    expect(res.expiresAt.getFullYear()).toBe(2026);

    const fromGetter = res.expiresAt;
    fromGetter.setFullYear(2030);
    expect(res.expiresAt.getFullYear()).toBe(2026);
  });
});

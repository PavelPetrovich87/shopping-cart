import { describe, it, expect, beforeEach } from 'vitest';
import { ProductVariant } from '../ProductVariant';
import { StockReservation } from '../StockReservation';
import { Money } from '@/shared/domain/Money';
import type {
  StockReserved,
  StockDepleted,
  StockReleased,
} from '../InventoryEvents';

describe('ProductVariant', () => {
  const skuId = 'sku-123';
  const totalOnHand = 100;
  const basePrice = Money.fromPrice(25.99);
  let variant: ProductVariant;

  beforeEach(() => {
    variant = new ProductVariant(skuId, basePrice, totalOnHand);
  });

  it('should initialize with correct values', () => {
    expect(variant.id).toBe(skuId);
    expect(variant.basePrice.rawCents).toBe(2599);
    expect(variant.totalOnHand).toBe(totalOnHand);
    expect(variant.sold).toBe(0);
    expect(variant.version).toBe(0);
    expect(variant.reservations).toEqual([]);
  });

  it('should throw if totalOnHand is negative', () => {
    expect(() => new ProductVariant(skuId, basePrice, -1)).toThrow('ProductVariant totalOnHand cannot be negative');
  });

  it('should throw if sold is negative', () => {
    expect(() => new ProductVariant(skuId, basePrice, 100, -1)).toThrow('ProductVariant sold cannot be negative');
  });

  describe('reserve', () => {
    it('should successfully reserve stock, increment version, and record StockReserved event', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      const orderId = 'order-1';
      const qty = 10;
      const ttl = 15 * 60 * 1000; // 15 mins

      variant.reserve(orderId, qty, ttl, now);

      expect(variant.availableStock(now)).toBe(90);
      expect(variant.reservations).toHaveLength(1);
      expect(variant.version).toBe(1);

      const events = variant.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('StockReserved');
    });

    it('should throw if insufficient stock and NOT increment version', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      expect(() => variant.reserve('order-huge', 101, 1000, now)).toThrow('Insufficient stock');
      expect(variant.version).toBe(0);
    });
  });

  describe('releaseReservation', () => {
    it('should release an existing reservation, increment version, and record StockReleased event', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      variant.reserve('order-1', 10, 60000, now);
      const versionAfterReserve = variant.version;

      variant.releaseReservation('order-1');

      expect(variant.reservations).toHaveLength(0);
      expect(variant.version).toBe(versionAfterReserve + 1);

      const events = variant.pullEvents();
      expect(events).toHaveLength(2); // reserve + release
      expect(events[1].eventName).toBe('StockReleased');
    });

    it('should NOT increment version if reservation not found', () => {
      const initialVersion = variant.version;
      variant.releaseReservation('unknown-order');
      expect(variant.version).toBe(initialVersion);
    });
  });

  describe('confirmDepletion', () => {
    it('should permanently deplete stock, increment version, and record StockDepleted event', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      variant.reserve('order-1', 10, 60000, now);
      const versionAfterReserve = variant.version;

      variant.confirmDepletion('order-1');

      expect(variant.totalOnHand).toBe(90);
      expect(variant.sold).toBe(10);
      expect(variant.version).toBe(versionAfterReserve + 1);

      const events = variant.pullEvents();
      expect(events).toHaveLength(2); // reserve + deplete
      expect(events[1].eventName).toBe('StockDepleted');
    });

    it('should throw and NOT increment version if reservation is not found', () => {
      const initialVersion = variant.version;
      expect(() => variant.confirmDepletion('unknown-order')).toThrow('Reservation not found');
      expect(variant.version).toBe(initialVersion);
    });
  });

  describe('availableStock', () => {
    it('should return totalOnHand if there are no reservations', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      expect(variant.availableStock(now)).toBe(totalOnHand);
    });

    it('should ignore expired reservations', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      const expiredAt = new Date('2026-03-09T11:59:00Z');
      
      // Manually add an expired reservation for testing
      (variant as any)._reservations.push(new StockReservation('old', 10, expiredAt));

      expect(variant.availableStock(now)).toBe(100);
    });
  });
});

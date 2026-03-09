import { describe, it, expect, beforeEach } from 'vitest';
import { ProductVariant } from '../ProductVariant';
import { StockReservation } from '../StockReservation';
import type {
  StockReserved,
  StockDepleted,
  StockReleased,
} from '../InventoryEvents';

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

  describe('reserve', () => {
    it('should successfully reserve stock and record StockReserved event', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      const orderId = 'order-1';
      const qty = 10;
      const ttl = 15 * 60 * 1000; // 15 mins

      variant.reserve(orderId, qty, ttl, now);

      expect(variant.availableStock(now)).toBe(90);
      expect(variant.reservations).toHaveLength(1);
      expect(variant.reservations[0].orderId).toBe(orderId);
      expect(variant.reservations[0].quantity).toBe(qty);

      const events = variant.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('StockReserved');
      const event = events[0] as StockReserved;
      expect(event.payload.orderId).toBe(orderId);
      expect(event.payload.quantity).toBe(qty);
    });

    it('should throw if quantity is less than or equal to zero', () => {
      const now = new Date();
      expect(() => variant.reserve('order-1', 0, 1000, now)).toThrow('Quantity must be greater than zero');
      expect(() => variant.reserve('order-1', -5, 1000, now)).toThrow('Quantity must be greater than zero');
    });

    it('should throw if insufficient stock', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      expect(() => variant.reserve('order-huge', 101, 1000, now)).toThrow('Insufficient stock');
    });

    it('should allow reservation after previous ones expired', () => {
      const now1 = new Date('2026-03-09T12:00:00Z');
      variant.reserve('order-1', 60, 60000, now1); // 1 min TTL
      
      const now2 = new Date('2026-03-09T12:02:00Z'); // 2 mins later
      expect(variant.availableStock(now2)).toBe(100);
      
      // Should allow reserving another 60 since the first one expired
      expect(() => variant.reserve('order-2', 60, 60000, now2)).not.toThrow();
    });
  });

  describe('releaseReservation', () => {
    it('should release an existing reservation and record StockReleased event', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      variant.reserve('order-1', 10, 60000, now);
      variant.pullEvents(); // Clear initial event

      variant.releaseReservation('order-1');

      expect(variant.reservations).toHaveLength(0);
      expect(variant.availableStock(now)).toBe(100);

      const events = variant.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('StockReleased');
      const event = events[0] as StockReleased;
      expect(event.payload.orderId).toBe('order-1');
      expect(event.payload.quantity).toBe(10);
    });

    it('should be idempotent and not record event if reservation not found', () => {
      variant.releaseReservation('unknown-order');
      expect(variant.pullEvents()).toHaveLength(0);
    });
  });

  describe('confirmDepletion', () => {
    it('should permanently deplete stock and record StockDepleted event', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      variant.reserve('order-1', 10, 60000, now);
      variant.pullEvents(); // Clear initial event

      variant.confirmDepletion('order-1');

      expect(variant.totalOnHand).toBe(90);
      expect(variant.sold).toBe(10);
      expect(variant.reservations).toHaveLength(0);
      expect(variant.availableStock(now)).toBe(90);

      const events = variant.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('StockDepleted');
      const event = events[0] as StockDepleted;
      expect(event.payload.orderId).toBe('order-1');
      expect(event.payload.quantity).toBe(10);
    });

    it('should throw if reservation is not found', () => {
      expect(() => variant.confirmDepletion('unknown-order')).toThrow('Reservation not found');
    });
  });

  describe('pullEvents', () => {
    it('should return and clear events', () => {
      const now = new Date('2026-03-09T12:00:00Z');
      variant.reserve('order-1', 10, 60000, now);
      
      const events = variant.pullEvents();
      expect(events).toHaveLength(1);
      expect(variant.pullEvents()).toHaveLength(0);
    });
  });
});

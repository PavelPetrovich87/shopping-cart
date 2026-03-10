import { describe, it, expect } from 'vitest';
import { Coupon, CouponType, CouponStatus } from '../Coupon';
import { Money } from '@/shared/domain/Money';

describe('Coupon Aggregate Root', () => {
  describe('Creation & Validation', () => {
    it('should create a valid flat coupon', () => {
      const coupon = Coupon.create({
        code: 'SAVE10',
        discountType: CouponType.FLAT,
        discountValue: 1000, // $10.00
      });

      expect(coupon.code).toBe('SAVE10');
      expect(coupon.discountType).toBe(CouponType.FLAT);
      expect(coupon.discountValue).toBe(1000);
      expect(coupon.status).toBe(CouponStatus.ACTIVE);
    });

    it('should create a valid percentage coupon', () => {
      const coupon = Coupon.create({
        code: 'TENOFF',
        discountType: CouponType.PERCENTAGE,
        discountValue: 10,
      });

      expect(coupon.discountValue).toBe(10);
    });

    it('should throw error for empty code', () => {
      expect(() => {
        Coupon.create({
          code: '',
          discountType: CouponType.FLAT,
          discountValue: 1000,
        });
      }).toThrow();
    });

    it('should throw error for invalid code characters', () => {
      expect(() => {
        Coupon.create({
          code: 'SAVE-10',
          discountType: CouponType.FLAT,
          discountValue: 1000,
        });
      }).toThrow();
    });

    it('should throw error for negative discount value', () => {
      expect(() => {
        Coupon.create({
          code: 'BAD',
          discountType: CouponType.FLAT,
          discountValue: -100,
        });
      }).toThrow();
    });

    it('should throw error for percentage > 100', () => {
      expect(() => {
        Coupon.create({
          code: 'BADPERC',
          discountType: CouponType.PERCENTAGE,
          discountValue: 110,
        });
      }).toThrow();
    });
  });

  describe('Lifecycle & Status', () => {
    it('should be valid when active and not expired and return event', () => {
      const coupon = Coupon.create({
        code: 'VALID',
        discountType: CouponType.FLAT,
        discountValue: 500,
        expirationDate: new Date('2099-01-01'),
      });

      const result = coupon.validate({ currentDate: new Date('2026-01-01') });
      expect(result.isValid).toBe(true);
      expect(result.events[0].eventName).toBe('CouponValidated');
    });

    it('should be invalid when inactive and return failure event', () => {
      const coupon = Coupon.create({
        code: 'INACTIVE',
        discountType: CouponType.FLAT,
        discountValue: 500,
        status: CouponStatus.INACTIVE,
      });

      const validation = coupon.validate({ currentDate: new Date() });
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('Sorry, but this coupon is inactive');
      expect(validation.events[0].eventName).toBe('CouponValidationFailed');
    });

    it('should be invalid when expired and return failure event', () => {
      const coupon = Coupon.create({
        code: 'EXPIRED',
        discountType: CouponType.FLAT,
        discountValue: 500,
        expirationDate: new Date('2020-01-01'),
      });

      const validation = coupon.validate({ currentDate: new Date('2026-01-01') });
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('Sorry, but this coupon has expired');
      expect(validation.events[0].eventName).toBe('CouponValidationFailed');
    });
  });

  describe('Discount Calculation', () => {
    it('should calculate flat discount and return event', () => {
      const coupon = Coupon.create({
        code: 'SAVE10',
        discountType: CouponType.FLAT,
        discountValue: 1000, // $10.00
      });

      const subtotal = Money.fromPrice(50);
      const { discount, events } = coupon.calculateDiscount(subtotal);

      expect(discount.rawCents).toBe(1000);
      expect(events[0].eventName).toBe('DiscountCalculated');
      expect(events[0].payload.discountCents).toBe(1000);
    });

    it('should calculate percentage discount and return event', () => {
      const coupon = Coupon.create({
        code: 'TENOFF',
        discountType: CouponType.PERCENTAGE,
        discountValue: 10, // 10%
      });

      const subtotal = Money.fromPrice(100);
      const { discount, events } = coupon.calculateDiscount(subtotal);

      expect(discount.rawCents).toBe(1000);
      expect(events[0].eventName).toBe('DiscountCalculated');
      expect(events[0].payload.discountCents).toBe(1000);
    });

    it('should cap flat discount at subtotal', () => {
      const coupon = Coupon.create({
        code: 'BIGSAVE',
        discountType: CouponType.FLAT,
        discountValue: 5000, // $50.00
      });

      const subtotal = Money.fromPrice(30);
      const { discount, events } = coupon.calculateDiscount(subtotal);

      expect(discount.rawCents).toBe(3000); // Capped at $30.00
      expect(events[0].payload.discountCents).toBe(3000);
    });
  });
});

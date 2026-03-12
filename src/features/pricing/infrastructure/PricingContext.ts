import { Coupon } from '../domain/Coupon';
import { InMemoryCouponRepository } from './InMemoryCouponRepository';
import { createValidateCoupon } from '../application/use-cases/ValidateCoupon';
import { createCalculateDiscount } from '../application/use-cases/CalculateDiscount';
import { ValidateCoupon } from '../application/ports/IValidateCoupon';
import { CalculateDiscount } from '../application/ports/ICalculateDiscount';

/**
 * Pricing Context (Composition Root)
 * Responsible for wiring dependencies and providing the external API for the context.
 */
export interface PricingContext {
  readonly validateCoupon: ValidateCoupon;
  readonly calculateDiscount: CalculateDiscount;
}

/**
 * Factory function to create and initialize the Pricing context.
 * In a real application, this might load data from a database or remote API.
 * For now, it initializes an in-memory repository with seed data.
 */
export const createPricingContext = (initialCoupons: any[] = []): PricingContext => {
  // 1. Map raw data to domain aggregates
  const seedCoupons = initialCoupons.map((data) => {
    return Coupon.create({
      code: data.coupon_code,
      discountType: data.discount_amount ? 'FLAT' : 'PERCENTAGE',
      discountValue: data.discount_amount 
        ? data.discount_amount * 100 // Convert to cents
        : data.discount_percentage,
      status: 'ACTIVE'
    });
  });

  // 2. Instantiate dependencies
  const repository = new InMemoryCouponRepository(seedCoupons);

  // 3. Wire use cases
  const validateCoupon = createValidateCoupon(repository);
  const calculateDiscount = createCalculateDiscount(repository);

  // 4. Return initialized context
  return {
    validateCoupon,
    calculateDiscount
  };
};

// Singleton instance for the application (default initialization)
// Note: In production, seed data would be fetched from an API
import couponsData from '../../../../data/coupons.json';
export const pricingContext = createPricingContext(couponsData);

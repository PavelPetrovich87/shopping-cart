import { Money } from '@/shared/domain/Money';
import { ICouponRepository } from '../../domain/ports/ICouponRepository';
import { CalculateDiscount } from '../ports/ICalculateDiscount';
import { MoneyResult } from '../../domain/PricingResults';

/**
 * Implementation of the CalculateDiscount use case.
 * Coordinates repository lookup and aggregate calculation logic.
 * 
 * @param repository The repository port for coupon data.
 * @returns The use case implementation function.
 */
export const createCalculateDiscount = (repository: ICouponRepository): CalculateDiscount => {
  return async (code: string, subtotal: Money): Promise<MoneyResult> => {
    // 1. Basic input validation
    if (!code || code.trim() === '') {
      return { success: false, error: 'Please enter a valid code' };
    }

    // 2. Repository lookup
    const coupon = await repository.findByCode(code.trim());

    if (!coupon) {
      return { success: false, error: "Sorry, but this coupon doesn't exist" };
    }

    // 3. Delegate to aggregate root for calculation
    const { discount } = coupon.calculateDiscount(subtotal);

    // 4. Return result
    return {
      success: true,
      value: discount
    };
  };
};

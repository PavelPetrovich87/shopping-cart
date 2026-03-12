import { Money } from '@/shared/domain/Money';
import { ICouponRepository } from '../../domain/ports/ICouponRepository';
import { ValidateCoupon } from '../ports/IValidateCoupon';
import { CouponResult } from '../../domain/PricingResults';

/**
 * Implementation of the ValidateCoupon use case.
 * Coordinate repository lookup and aggregate validation.
 * 
 * @param repository The repository port for coupon data.
 * @returns The use case implementation function.
 */
export const createValidateCoupon = (repository: ICouponRepository): ValidateCoupon => {
  return async (code: string): Promise<CouponResult> => {
    // 1. Basic input validation (Tier 2: Use Case layer)
    if (!code || code.trim() === '') {
      return { success: false, error: 'Please enter a valid code' };
    }

    // 2. Repository lookup (Data Port)
    const coupon = await repository.findByCode(code.trim());

    if (!coupon) {
      return { success: false, error: "Sorry, but this coupon doesn't exist" };
    }

    // 3. Domain validation (Tier 3: Aggregate layer)
    // Using current date for validation
    const validationResult = coupon.validate({ currentDate: new Date() });

    if (!validationResult.isValid) {
      return { success: false, error: validationResult.error || 'INVALID_CODE' };
    }

    // 4. Map to success result
    const successResult: any = { code: coupon.code };

    if (coupon.discountType === 'FLAT') {
      successResult.discount_amount = Money.fromCents(coupon.discountValue);
    } else {
      successResult.discount_percentage = coupon.discountValue;
    }

    return {
      success: true,
      value: successResult
    };
  };
};

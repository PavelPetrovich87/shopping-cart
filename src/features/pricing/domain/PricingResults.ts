import { Result } from '@/shared/domain/Result';
import { Money } from '@/shared/domain/Money';

/**
 * Domain-specific result for coupon validation.
 */
export type CouponError = 'INVALID_CODE' | 'EXPIRED' | 'COUPON_NOT_FOUND' | 'MIN_SUBTOTAL_NOT_MET';

export type CouponSuccess = {
  code: string;
  discount_amount?: Money;
  discount_percentage?: number;
};

export type CouponResult = Result<CouponSuccess, CouponError>;

/**
 * Domain-specific result for discount calculations.
 */
export type MoneyError = 'NEGATIVE_TOTAL' | 'CALCULATION_FAILURE';

export type MoneyResult = Result<Money, MoneyError>;

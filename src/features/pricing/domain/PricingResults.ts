import { Result } from '@/shared/domain/Result';
import { Money } from '@/shared/domain/Money';

/**
 * Domain-specific result for coupon validation.
 * Using string for error message per spec's strict string requirements.
 */
export type CouponError = string;

export type CouponSuccess = {
  code: string;
  discount_amount?: Money;
  discount_percentage?: number;
};

export type CouponResult = Result<CouponSuccess, CouponError>;

/**
 * Domain-specific result for discount calculations.
 * Using string for error message per spec's strict string requirements.
 */
export type MoneyError = string;

export type MoneyResult = Result<Money, MoneyError>;

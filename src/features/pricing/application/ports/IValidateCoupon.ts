import { CouponResult } from '@/features/pricing/domain/PricingResults';

/**
 * Inbound port for validating a coupon code.
 */
export type ValidateCoupon = (code: string) => Promise<CouponResult>;

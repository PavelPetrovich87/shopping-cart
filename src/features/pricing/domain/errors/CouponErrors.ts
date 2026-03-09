/**
 * Domain-specific errors for the Pricing context.
 * Manual property definition used per project's erasableSyntaxOnly: true.
 */

export class CouponNotFoundError extends Error {
  public readonly code: string;

  constructor(code: string) {
    super(`Sorry, but this coupon doesn't exist: ${code}`);
    this.name = 'CouponNotFoundError';
    this.code = code;
    // Ensure the prototype is set correctly for custom errors in TS
    Object.setPrototypeOf(this, CouponNotFoundError.prototype);
  }
}

export class InvalidCouponDataError extends Error {
  public readonly details: string;

  constructor(details: string) {
    super(`Invalid coupon data: ${details}`);
    this.name = 'InvalidCouponDataError';
    this.details = details;
    Object.setPrototypeOf(this, InvalidCouponDataError.prototype);
  }
}

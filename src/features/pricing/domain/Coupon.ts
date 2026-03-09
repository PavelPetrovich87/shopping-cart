import { z } from 'zod';

export const CouponType = {
  FLAT: 'FLAT',
  PERCENTAGE: 'PERCENTAGE',
} as const;

export type CouponType = (typeof CouponType)[keyof typeof CouponType];

export const CouponStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type CouponStatus = (typeof CouponStatus)[keyof typeof CouponStatus];

export const CouponSchema = z.object({
  code: z.string().min(1).regex(/^[a-zA-Z0-9]+$/),
  discountType: z.nativeEnum(CouponType),
  discountValue: z.number().positive(),
  status: z.nativeEnum(CouponStatus).default(CouponStatus.ACTIVE),
  expirationDate: z.date().optional(),
}).refine((data) => {
  if (data.discountType === CouponType.PERCENTAGE) {
    return data.discountValue >= 1 && data.discountValue <= 100;
  }
  return true;
}, {
  message: "Percentage discount must be between 1 and 100",
  path: ["discountValue"],
});

export type CouponProps = z.infer<typeof CouponSchema>;
export type CouponInput = z.input<typeof CouponSchema>;

/**
 * Coupon Aggregate Root
 * Encapsulates promotional code business logic and lifecycle rules.
 */
export class Coupon {
  private readonly props: CouponProps;

  private constructor(props: CouponProps) {
    this.props = props;
  }

  /**
   * Factory method: Create a new Coupon instance after validating input.
   */
  public static create(input: CouponInput): Coupon {
    const validatedProps = CouponSchema.parse(input);
    return new Coupon(validatedProps);
  }

  // Getters for individual properties
  public get code(): string { return this.props.code; }
  public get discountType(): CouponType { return this.props.discountType; }
  public get discountValue(): number { return this.props.discountValue; }
  public get status(): CouponStatus { return this.props.status; }
  public get expirationDate(): Date | undefined { return this.props.expirationDate; }

  /**
   * Internal validation logic for status and expiration.
   */
  public validate(context: { currentDate: Date }): { isValid: boolean; error?: string } {
    if (this.props.status === CouponStatus.INACTIVE) {
      return { isValid: false, error: 'Sorry, but this coupon is inactive' };
    }

    if (this.props.expirationDate && context.currentDate > this.props.expirationDate) {
      return { isValid: false, error: 'Sorry, but this coupon has expired' };
    }

    return { isValid: true };
  }

  /**
   * Helper to quickly check validity.
   */
  public isValid(currentDate: Date): boolean {
    return this.validate({ currentDate }).isValid;
  }
}

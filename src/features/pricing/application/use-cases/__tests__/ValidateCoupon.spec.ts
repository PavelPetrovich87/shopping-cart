import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createValidateCoupon } from '../ValidateCoupon';
import { ICouponRepository } from '../../../domain/ports/ICouponRepository';
import { Coupon } from '../../../domain/Coupon';

describe('ValidateCoupon Use Case', () => {
  let mockRepository: ICouponRepository;
  let validateCoupon: any;

  beforeEach(() => {
    mockRepository = {
      findByCode: vi.fn(),
      save: vi.fn(),
      findAll: vi.fn(),
    } as any;
    validateCoupon = createValidateCoupon(mockRepository);
  });

  it('should return error if code is empty', async () => {
    const result = await validateCoupon('');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Please enter a valid code');
  });

  it('should return error if code is whitespace only', async () => {
    const result = await validateCoupon('   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Please enter a valid code');
  });

  it('should return error if coupon is not found in repository', async () => {
    vi.mocked(mockRepository.findByCode).mockResolvedValue(null);
    const result = await validateCoupon('NONEXISTENT');
    expect(result.success).toBe(false);
    expect(result.error).toBe("Sorry, but this coupon doesn't exist");
  });

  it('should return success if valid coupon is found', async () => {
    const coupon = Coupon.create({
      code: 'SAVE10',
      discountType: 'FLAT',
      discountValue: 1000, // $10.00
      status: 'ACTIVE'
    });
    vi.mocked(mockRepository.findByCode).mockResolvedValue(coupon);

    const result = await validateCoupon('SAVE10');
    expect(result.success).toBe(true);
    expect(result.value.code).toBe('SAVE10');
    expect(result.value.discount_amount?.rawCents).toBe(1000);
  });

  it('should return error if coupon is inactive', async () => {
    const coupon = Coupon.create({
      code: 'INACTIVE10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      status: 'INACTIVE'
    });
    vi.mocked(mockRepository.findByCode).mockResolvedValue(coupon);

    const result = await validateCoupon('INACTIVE10');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Sorry, but this coupon is inactive');
  });

  it('should return error if coupon is expired', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday

    const coupon = Coupon.create({
      code: 'EXPIRED10',
      discountType: 'FLAT',
      discountValue: 1000,
      status: 'ACTIVE',
      expirationDate: pastDate
    });
    vi.mocked(mockRepository.findByCode).mockResolvedValue(coupon);

    const result = await validateCoupon('EXPIRED10');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Sorry, but this coupon has expired');
  });

  it('should return success for percentage coupon', async () => {
    const coupon = Coupon.create({
      code: 'SAVE20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      status: 'ACTIVE'
    });
    vi.mocked(mockRepository.findByCode).mockResolvedValue(coupon);

    const result = await validateCoupon('SAVE20');
    expect(result.success).toBe(true);
    expect(result.value.code).toBe('SAVE20');
    expect(result.value.discount_percentage).toBe(20);
  });

  it('should trim whitespace from code before searching', async () => {
    const coupon = Coupon.create({
      code: 'SAVE10',
      discountType: 'FLAT',
      discountValue: 1000,
      status: 'ACTIVE'
    });
    vi.mocked(mockRepository.findByCode).mockResolvedValue(coupon);

    const result = await validateCoupon(' SAVE10 ');
    expect(mockRepository.findByCode).toHaveBeenCalledWith('SAVE10');
    expect(result.success).toBe(true);
  });

  it('should call coupon.validate and generate domain events', async () => {
    const coupon = Coupon.create({
      code: 'SAVE10',
      discountType: 'FLAT',
      discountValue: 1000,
      status: 'ACTIVE'
    });
    const validateSpy = vi.spyOn(coupon, 'validate');
    vi.mocked(mockRepository.findByCode).mockResolvedValue(coupon);

    await validateCoupon('SAVE10');
    
    expect(validateSpy).toHaveBeenCalled();
    const validationResult = validateSpy.mock.results[0].value;
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.events.length).toBeGreaterThan(0);
    expect(validationResult.events[0].eventName).toBe('CouponValidated');
  });
});

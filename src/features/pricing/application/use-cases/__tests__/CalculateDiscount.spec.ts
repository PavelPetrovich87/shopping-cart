import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCalculateDiscount } from '../CalculateDiscount';
import { ICouponRepository } from '../../../domain/ports/ICouponRepository';
import { Coupon } from '../../../domain/Coupon';
import { Money } from '@/shared/domain/Money';

describe('CalculateDiscount Use Case', () => {
  let mockRepository: ICouponRepository;
  let calculateDiscount: any;

  beforeEach(() => {
    mockRepository = {
      findByCode: vi.fn(),
      save: vi.fn(),
      findAll: vi.fn(),
    } as any;
    calculateDiscount = createCalculateDiscount(mockRepository);
  });

  it('should return error if code is empty', async () => {
    const result = await calculateDiscount('', Money.fromCents(1000));
    expect(result.success).toBe(false);
    expect(result.error).toBe('Please enter a valid code');
  });

  it('should return error if coupon is not found', async () => {
    vi.mocked(mockRepository.findByCode).mockResolvedValue(null);
    const result = await calculateDiscount('NONEXISTENT', Money.fromCents(1000));
    expect(result.success).toBe(false);
    expect(result.error).toBe("Sorry, but this coupon doesn't exist");
  });

  it('should correctly calculate FLAT discount', async () => {
    const coupon = Coupon.create({
      code: 'SAVE10',
      discountType: 'FLAT',
      discountValue: 1000, // $10.00
      status: 'ACTIVE'
    });
    vi.mocked(mockRepository.findByCode).mockResolvedValue(coupon);

    const result = await calculateDiscount('SAVE10', Money.fromCents(5000)); // $50.00
    expect(result.success).toBe(true);
    expect(result.value.rawCents).toBe(1000); // $10.00
  });

  it('should correctly calculate PERCENTAGE discount', async () => {
    const coupon = Coupon.create({
      code: 'SAVE20',
      discountType: 'PERCENTAGE',
      discountValue: 20, // 20%
      status: 'ACTIVE'
    });
    vi.mocked(mockRepository.findByCode).mockResolvedValue(coupon);

    const result = await calculateDiscount('SAVE20', Money.fromCents(5000)); // $50.00
    expect(result.success).toBe(true);
    expect(result.value.rawCents).toBe(1000); // 20% of $50 = $10
  });

  it('should cap discount at subtotal if it exceeds it', async () => {
    const coupon = Coupon.create({
      code: 'SAVE50',
      discountType: 'FLAT',
      discountValue: 5000, // $50.00
      status: 'ACTIVE'
    });
    vi.mocked(mockRepository.findByCode).mockResolvedValue(coupon);

    const result = await calculateDiscount('SAVE50', Money.fromCents(1000)); // $10.00
    expect(result.success).toBe(true);
    expect(result.value.rawCents).toBe(1000); // Capped at $10.00
  });

  it('should return zero discount for zero subtotal', async () => {
    const coupon = Coupon.create({
      code: 'SAVE10',
      discountType: 'FLAT',
      discountValue: 1000,
      status: 'ACTIVE'
    });
    vi.mocked(mockRepository.findByCode).mockResolvedValue(coupon);

    const result = await calculateDiscount('SAVE10', Money.fromCents(0));
    expect(result.success).toBe(true);
    expect(result.value.rawCents).toBe(0);
  });

  it('should call coupon.calculateDiscount and generate domain event', async () => {
    const coupon = Coupon.create({
      code: 'SAVE10',
      discountType: 'FLAT',
      discountValue: 1000,
      status: 'ACTIVE'
    });
    const calculateSpy = vi.spyOn(coupon, 'calculateDiscount');
    vi.mocked(mockRepository.findByCode).mockResolvedValue(coupon);

    const result = await calculateDiscount('SAVE10', Money.fromCents(5000));
    
    expect(calculateSpy).toHaveBeenCalledWith(expect.objectContaining({ rawCents: 5000 }));
    const calcResult = calculateSpy.mock.results[0].value;
    expect(calcResult.discount.rawCents).toBe(1000);
    expect(calcResult.events.length).toBe(1);
    expect(calcResult.events[0].eventName).toBe('DiscountCalculated');
    expect(calcResult.events[0].payload.code).toBe('SAVE10');
  });
});

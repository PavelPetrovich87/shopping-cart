import { Coupon } from '../domain/Coupon';
import { ICouponRepository } from '../domain/ports/ICouponRepository';

/**
 * In-memory implementation of ICouponRepository.
 * Useful for development and testing without a real backend.
 */
export class InMemoryCouponRepository implements ICouponRepository {
  private readonly coupons: Map<string, Coupon> = new Map();

  constructor(initialCoupons: Coupon[] = []) {
    initialCoupons.forEach((coupon) => {
      this.coupons.set(coupon.code, coupon);
    });
  }

  /**
   * Retrieves a coupon by its code.
   */
  public async findByCode(code: string): Promise<Coupon | null> {
    const coupon = this.coupons.get(code);
    return coupon || null;
  }

  /**
   * Persists a Coupon aggregate.
   */
  public async save(coupon: Coupon): Promise<void> {
    this.coupons.set(coupon.code, coupon);
  }

  /**
   * Retrieves all coupons.
   */
  public async findAll(): Promise<Coupon[]> {
    return Array.from(this.coupons.values());
  }
}

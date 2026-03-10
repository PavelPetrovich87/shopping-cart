import { Coupon } from '../Coupon';

/**
 * Driven port for Coupon persistence.
 * In Hexagonal Architecture, this is the contract that data adapters must fulfill.
 */
export interface ICouponRepository {
  /**
   * Retrieves a coupon by its unique alphanumeric code.
   * Returns null if no matching coupon is found.
   */
  findByCode(code: string): Promise<Coupon | null>;

  /**
   * Persists a Coupon aggregate root (create or update).
   */
  save(coupon: Coupon): Promise<void>;

  /**
   * Retrieves all coupons currently in the system.
   */
  findAll(): Promise<Coupon[]>;
}

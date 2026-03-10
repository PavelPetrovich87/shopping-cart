import { Cart } from '@/features/cart/domain/Cart';

/**
 * Driven port interface for Cart persistence.
 * Implementations are expected to be synchronous when backed by local state (e.g., Zustand).
 */
export interface ICartRepository {
  /**
   * Retrieves a Cart by its unique identifier.
   * @param id The unique identifier of the cart.
   * @returns The Cart aggregate.
   */
  getCart(id: string): Cart;

  /**
   * Persists the current state of the Cart aggregate.
   * @param cart The Cart aggregate to save.
   */
  saveCart(cart: Cart): void;
}

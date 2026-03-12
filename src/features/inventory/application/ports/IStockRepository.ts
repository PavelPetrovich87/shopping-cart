import { ProductVariant } from '../../domain/ProductVariant';

/**
 * Driven Port: Inventory Repository
 * Handles persistence of the ProductVariant aggregate root.
 */
export interface IStockRepository {
  /**
   * Retrieves a ProductVariant by its SKU ID.
   */
  findBySku(skuId: string): Promise<ProductVariant | null>;

  /**
   * Saves the state of a ProductVariant.
   * Implementation should use optimistic locking via the version field.
   */
  save(variant: ProductVariant): Promise<void>;
}

import { StockResult } from '@/features/cart/domain/StockResult';

/**
 * Driven port interface for communicating with the Inventory domain context.
 */
export interface IInventoryService {
  /**
   * Checks if a specific quantity of a product variant is available in stock.
   * @param skuId The identifier for the product variant.
   * @param quantity The requested quantity.
   * @returns A promise resolving to a StockResult (success or domain error).
   */
  checkStockAvailability(skuId: string, quantity: number): Promise<StockResult>;
}

import { Result } from '@/shared/domain/Result';

/**
 * Domain-specific result for stock availability checks.
 */
export type StockError = 'INVALID_SKU' | 'OUT_OF_STOCK' | 'INSUFFICIENT_STOCK';

export type StockSuccess = {
  available: boolean;
  currentStock: number;
};

export type StockResult = Result<StockSuccess, StockError>;

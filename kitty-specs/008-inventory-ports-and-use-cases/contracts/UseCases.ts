import { Result } from '../../../src/shared/domain/Result';

export interface CheckStockAvailability {
  execute(skuId: string, quantity: number): Promise<Result<{ available: boolean, currentStock: number }, 'VARIANT_NOT_FOUND'>>;
}

export interface ReserveStock {
  execute(skuId: string, orderId: string, quantity: number, ttl_ms?: number): Promise<Result<void, 'VARIANT_NOT_FOUND' | 'OUT_OF_STOCK'>>;
}

export interface ReleaseStockReservation {
  execute(skuId: string, orderId: string): Promise<Result<void, 'VARIANT_NOT_FOUND'>>;
}

export interface ConfirmStockDepletion {
  execute(skuId: string, orderId: string): Promise<Result<void, 'VARIANT_NOT_FOUND' | 'RESERVATION_NOT_FOUND'>>;
}

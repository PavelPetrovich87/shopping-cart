import { Result } from '@/shared/domain/Result';
import { IStockRepository } from '../ports/IStockRepository';

export class CheckStockAvailability {
  constructor(private readonly repository: IStockRepository) {}

  async execute(skuId: string, quantity: number): Promise<Result<{ available: boolean, currentStock: number }, 'VARIANT_NOT_FOUND'>> {
    const variant = await this.repository.findBySku(skuId);

    if (!variant) {
      return { success: false, error: 'VARIANT_NOT_FOUND' };
    }

    const now = new Date();
    const availableStock = variant.availableStock(now);

    return {
      success: true,
      value: {
        available: availableStock >= quantity,
        currentStock: availableStock
      }
    };
  }
}

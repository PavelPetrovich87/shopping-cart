import { Result } from '@/shared/domain/Result';
import { IStockRepository } from '../ports/IStockRepository';
import { IEventBus } from '@/shared/events/IEventBus';

export class ReserveStock {
  private readonly DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes

  constructor(
    private readonly repository: IStockRepository,
    private readonly eventBus: IEventBus
  ) {}

  async execute(
    skuId: string,
    orderId: string,
    quantity: number,
    ttl_ms?: number
  ): Promise<Result<void, 'VARIANT_NOT_FOUND' | 'OUT_OF_STOCK'>> {
    const variant = await this.repository.findBySku(skuId);

    if (!variant) {
      return { success: false, error: 'VARIANT_NOT_FOUND' };
    }

    const now = new Date();
    const ttl = ttl_ms ?? this.DEFAULT_TTL_MS;

    try {
      variant.reserve(orderId, quantity, ttl, now);
      
      await this.repository.save(variant);
      
      // Pull and publish events
      const events = variant.pullEvents();
      for (const event of events) {
        await this.eventBus.publish(event);
      }

      return { success: true, value: undefined };
    } catch (error: any) {
      if (error.message.includes('Insufficient stock')) {
        return { success: false, error: 'OUT_OF_STOCK' };
      }
      throw error;
    }
  }
}

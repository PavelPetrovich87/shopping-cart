import { Cart } from '@/features/cart/domain/Cart';
import { DomainEvent } from '@/shared/events/DomainEvent';
import { Result } from '@/shared/domain/Result';
import { ICartRepository } from '../ports/ICartRepository';
import { IInventoryService } from '../ports/IInventoryService';
import { IPricingService } from '../ports/IPricingService';

export type UseCaseResult = Result<{
  updatedCart: Cart;
  events: DomainEvent[];
}, string>;

export interface CartUseCaseDependencies {
  cartRepository: ICartRepository;
  inventoryService: IInventoryService;
  pricingService: IPricingService;
}

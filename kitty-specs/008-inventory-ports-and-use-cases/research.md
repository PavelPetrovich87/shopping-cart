# Research: Inventory Event Strategy & Port Design

## Domain Event Triggers
**Decision**: How to handle `CheckoutFailed` or `ReservationTimeoutEvent`?
**Rationale**: These events originate outside the Inventory context (likely in Checkout or a generic Scheduler).
**Solution**: 
1. Use cases `ReleaseStockReservation` and `ConfirmStockDepletion` should be designed to be called by external event subscribers.
2. Define a new `InventoryEventSubscriber` in the application layer that listens for these external events and executes the appropriate use cases.

## Repository Port Interface
**Decision**: What methods does `IStockRepository` need?
**Rationale**: It must support finding a variant by SKU and saving the updated aggregate root.
**Methods**:
- `findBySku(skuId: string): Promise<ProductVariant | null>`
- `save(variant: ProductVariant): Promise<void>`

## Error Handling with `Result`
**Decision**: How to report stock issues?
**Rationale**: Per user preference, we'll use the existing `Result` pattern.
**Errors**:
- `OUT_OF_STOCK`: Insufficient available stock for the requested quantity.
- `VARIANT_NOT_FOUND`: Specified SKU ID does not exist.
- `RESERVATION_NOT_FOUND`: Specified Order ID does not have a reservation for that SKU.

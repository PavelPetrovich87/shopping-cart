# Data Model: Inventory Application Layer

## Key Components

### Use Case: `CheckStockAvailability`
- **Input**: `skuId: string, quantity: number`
- **Output**: `Result<{ available: boolean, currentStock: number }, 'VARIANT_NOT_FOUND'>`

### Use Case: `ReserveStock`
- **Input**: `skuId: string, orderId: string, quantity: number, ttl_ms?: number`
- **Output**: `Result<void, 'VARIANT_NOT_FOUND' | 'OUT_OF_STOCK'>`
- **Event**: `StockReserved`

### Use Case: `ReleaseStockReservation`
- **Input**: `skuId: string, orderId: string`
- **Output**: `Result<void, 'VARIANT_NOT_FOUND'>` (silent if reservation not found?)
- **Event**: `StockReleased`

### Use Case: `ConfirmStockDepletion`
- **Input**: `skuId: string, orderId: string`
- **Output**: `Result<void, 'VARIANT_NOT_FOUND' | 'RESERVATION_NOT_FOUND'>`
- **Event**: `StockDepleted`

### Driven Port: `IStockRepository`
- `findBySku(skuId: string): Promise<ProductVariant | null>`
- `save(variant: ProductVariant): Promise<void>`

## Future Events (Triggers)
The application layer will eventually need to listen for:
- `CheckoutFailed` (triggering `ReleaseStockReservation`)
- `ReservationTimeout` (triggering `ReleaseStockReservation`)
- `OrderConfirmed` (triggering `ConfirmStockDepletion`)

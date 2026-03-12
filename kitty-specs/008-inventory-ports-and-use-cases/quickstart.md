# Quickstart: Inventory Use Cases

## Overview
This feature provides the application layer logic for interacting with inventory stock and reservations.

## Example: Checking Availability
```typescript
const result = await checkStockAvailability.execute('sku-123', 5);

if (result.success) {
  console.log(`Available: ${result.value.available}, Total: ${result.value.currentStock}`);
} else {
  console.log(`Error: ${result.error}`);
}
```

## Example: Reserving Stock
```typescript
const result = await reserveStock.execute('sku-123', 'order-abc', 2);

if (result.success) {
  console.log('Stock reserved successfully!');
} else {
  // result.error could be 'OUT_OF_STOCK' or 'VARIANT_NOT_FOUND'
  console.log(`Reservation failed: ${result.error}`);
}
```

## Example: Releasing a Reservation
```typescript
await releaseStockReservation.execute('sku-123', 'order-abc');
```

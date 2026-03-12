# Specification: Inventory Ports & Use Cases

## 1. Goal
Define the inventory port interfaces and implement bounded use cases for interacting with the `ProductVariant` Aggregate Root. This enables the cross-context checkout flow to check stock availability, reserve stock, and handle reservation lifecycle consistently without tight coupling to database details.

## 2. User Scenarios
* **Checkout Initiated (Valid Stock):** A user initiates checkout for their cart. The system checks availability and successfully reserves the requested stock. The user completes the order, and the stock is permanently depleted.
* **Checkout Failed/Cancelled:** A user initiates checkout and stock is reserved. The checkout flow fails, is cancelled, or the payment is declined. The system catches a specific domain event (e.g., `CheckoutFailed` if it exists or is created) and releases the previously reserved stock so it becomes available to others.
* **Reservation Timeout:** A user initiates checkout and holds the stock, but abandons the session. A timeout occurs, triggering a `ReservationTimeoutEvent` (to be defined/emitted by an external scheduler). The system catches this event and releases the reserved stock.
* **Insufficient Stock:** A user tries to checkout but the item's available stock is less than requested. The system returns an availability error and no reservation is placed.

## 3. Functional Requirements
- [ ] `FR-001`: CheckStockAvailability Use Case: Given a SKU ID and quantity, returns whether the quantity is available and the current stock level.
- [ ] `FR-002`: ReserveStock Use Case: Given a SKU ID, Order ID, and quantity, reserves the stock and emits `StockReserved`.
- [ ] `FR-003`: ReleaseStockReservation Use Case: Given an Order ID and SKU ID, releases an existing hold and emits `StockReleased`. This use case MUST be triggerable by domain events (customizable for `CheckoutFailed` or `ReservationTimeoutEvent`). If these events do not exist in the current shared event system, they must be created.
- [ ] `FR-004`: ConfirmStockDepletion Use Case: Given an Order ID and SKU ID, confirms the sale, reducing both the total and reserved stock, and emits `StockDepleted`.
- [ ] `FR-005`: IStockRepository Port: Defines the `findBySku(skuId)` and `save(variant)` contracts for persistence adapters, maintaining domain purity.

## 4. Key Entities
* **ProductVariant:** The Aggregate Root (from T-007).
* **StockReservation:** The Value Object tracking reservations.
* **Domain Events:** `StockReserved`, `StockReleased`, `StockDepleted` (existing), and potentially new trigger events (`CheckoutFailed`, `ReservationTimeoutEvent`).

## 5. Success Criteria
* 100% of tested stock reservations correctly reduce available stock.
* 100% of expired or cancelled holds restore the available stock properly via the `ReleaseStockReservation` use case.
* The system elegantly handles domain events to trigger reservation cleanup automatically without manual intervention.

## 6. Assumptions
* A mechanism to emit `ReservationTimeoutEvent` or `CheckoutFailed` will be available in the broader system, explicitly specified and tracked in **T-015 Checkout Flow**.

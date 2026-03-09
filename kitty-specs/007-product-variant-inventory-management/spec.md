# Specification: ProductVariant Inventory Management

## Purpose
The purpose of this feature is to implement the `ProductVariant` Aggregate Root within the Inventory context. It serves as the authoritative source for product availability, managing physical stock levels, sales tracking, and temporary stock reservations.

## User Scenarios
- **Reserving Stock**: A customer adds an item to their cart. The system creates a temporary reservation to ensure the item remains available during the checkout window.
- **Stock Depletion**: A customer completes a purchase. The reserved stock is permanently deducted from the total inventory.
- **Stock Release**: A customer abandons their cart or the checkout expires. The temporary reservation is removed, making the stock available for other users again.
- **Availability Check**: The frontend displays whether a product is "In Stock" based on the total quantity minus currently active (non-expired) reservations.

## Functional Requirements
- **FR-001: Stock Accounting**:
    - Track `totalOnHand` (physical items in the warehouse).
    - Track `sold` (total items permanently removed via completed orders).
    - Enforce `totalOnHand >= 0` invariant at all times.
- **FR-002: Pricing**:
    - Store a `basePrice` using the `Money` Value Object.
- **FR-003: Reservation Management**:
    - Support creating a `StockReservation` with an `orderId`, `quantity`, and `expiresAt` timestamp.
    - Calculate `availableStock` as `totalOnHand` minus the sum of all **active** reservations (where `expiresAt > now`).
    - Prevent reservations that would cause `availableStock` to drop below zero.
- **FR-004: Lifecycle Operations**:
    - `reserve(orderId, qty, ttl)`: Create a reservation if stock is available.
    - `releaseReservation(orderId)`: Manually remove a reservation (e.g., on cart clear).
    - `confirmDepletion(orderId)`: Permanently deduct reserved quantity from `totalOnHand`, increment `sold`, and remove the reservation.
- **FR-005: Domain Events**:
    - Emit `StockReserved` when a reservation is successful.
    - Emit `StockDepleted` when stock is permanently removed.
    - Emit `StockReleased` when a reservation is cancelled or removed.

## Success Criteria
- **Accuracy**: `availableStock` accurately reflects real-time availability by ignoring expired reservations without requiring external cleanup.
- **Integrity**: Physical stock (`totalOnHand`) never drops below zero.
- **Atomicity**: Inventory operations (reserve/confirm) are atomic within the aggregate.
- **Observability**: Every state change that affects stock levels triggers a corresponding domain event.

## Key Entities & Data Model
- **ProductVariant (Aggregate Root)**:
    - `id`: SkuId.
    - `basePrice`: Money VO.
    - `totalOnHand`: Integer.
    - `sold`: Integer.
    - `reservations`: Collection of `StockReservation` objects.
- **StockReservation (Value Object)**:
    - `orderId`: String.
    - `quantity`: Integer.
    - `expiresAt`: Date/Timestamp.

## Assumptions
- Reservation TTL (Time To Live) is provided by the application layer or a default configuration.
- The `Money` Value Object from `T-001` is available for use.
- "Now" (current time) for reservation checking will be passed as a dependency or parameter to ensure testability.

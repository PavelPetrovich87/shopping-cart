# Feature Specification: Cart Use Cases

## 1. Introduction
**Purpose**: The purpose of this feature is to implement the core Cart application use cases: `AddItemToCart`, `RemoveItemFromCart`, `ChangeCartItemQuantity`, `ApplyCouponToCart`, `RemoveCouponFromCart`, and `InitiateCheckout`. These use cases orchestrate domain logic from the Cart aggregate, validate operations via driven ports (Inventory and Pricing), and publish domain events to the EventBus.

**Business Value**: By centralizing cart operations in dedicated use cases, we ensure that domain invariants (like stock limits and valid pricing combinations) are strictly enforced before an order proceeds. It allows the system to remain decoupled from the UI, ensuring that all state mutations flow through a predictable and testable process.

## 2. Actors & Assumptions
- **Actors**: 
  - **Shopper (End User)**: Interacts with the cart to add/remove items, change quantities, apply coupons, and start checkout.
  - **System/Orchestrator**: Executes the backend application logic for each initiated action, ensuring ports are called correctly.
- **Assumptions**: 
  - The `Cart` aggregate root (T-004), `EventBus` (T-002), and driven port interfaces (T-005) are fully implemented and available.
  - Dependencies on `IInventoryService` and `IPricingService` are available and can be mocked for testing.

## 3. User Scenarios & Testing

### Scenario 1: Adding an item with sufficient stock
- **Given** a shopper wants to add a specific product variant to their cart.
- **When** the `AddItemToCart` use case is initiated.
- **Then** the use case checks stock via `IInventoryService`, adds it to the `Cart` aggregate, and emits standard domain events indicating the addition.

### Scenario 2: Adding an item that exceeds available stock
- **Given** a shopper tries to add a quantity of a variant to their cart.
- **When** the requested quantity exceeds the stock available in the `IInventoryService`.
- **Then** the `AddItemToCart` use case predictably errors out and does not modify the cart.

### Scenario 3: Applying an invalid or rejected coupon
- **Given** a shopper inputs a coupon code.
- **When** `ApplyCouponToCart` validates the code via `IPricingService` and receives a failure.
- **Then** the cart remains unchanged, and the use case yields the appropriate domain error (e.g., "Please enter a valid code").

### Scenario 4: Initiating Checkout successfully
- **Given** a shopper with a validated cart attempts to checkout.
- **When** `InitiateCheckout` validates all cart items against `IInventoryService` stock levels.
- **Then** the cart transitions to a checkout-pending state, and a `CheckoutInitiated` event is emitted to notify the inventory context.

## 4. Functional Requirements

1. **FR-001: Add Item to Cart (`AddItemToCart`)**:
   - Must check stock availability via `IInventoryService` before adding.
   - Must update the Cart aggregate and publish an `ItemAddedToCart` event via `EventBus`.

2. **FR-002: Remove Item from Cart (`RemoveItemFromCart`)**:
   - Must remove the specified item from the Cart aggregate.
   - Must publish an `ItemRemovedFromCart` event via `EventBus`.

3. **FR-003: Change Item Quantity (`ChangeCartItemQuantity`)**:
   - Must check stock availability via `IInventoryService` before updating the `CartItem` quantity.
   - Must publish a `CartItemQuantityChanged` event.

4. **FR-004: Apply Coupon (`ApplyCouponToCart`)**:
   - Must validate the code via `IPricingService` before applying it to the Cart.
   - Must handle application errors cleanly if the coupon is invalid.

5. **FR-005: Remove Coupon (`RemoveCouponFromCart`)**:
   - Must remove the applied coupon from the Cart.

6. **FR-006: Initiate Checkout (`InitiateCheckout`)**:
   - Must validate stock for *all* items currently in the cart.
   - Must transition the Cart state to `Checkout_Pending`.
   - Must emit a `CheckoutInitiated` event.
   - Must ensure happy and error paths are tested with mocked ports.

## 5. Success Criteria
- Every cart mutation relies on the aggregate root to enforce invariants and on the application use case to coordinate infrastructure checks (like stock).
- All use cases successfully publish appropriate domain events via the EventBus.
- Unit testing covers 100% of the newly implemented use cases, simulating both happy paths and error paths (e.g., stock exhaustion during checkout) using mocked ports.

## 6. Key Entities / Data
- **Cart**: The aggregate root managing `CartItem` elements.
- **IInventoryService**: Port for verifying product variant availability.
- **IPricingService**: Port for validating promotional coupon codes.
- **EventBus**: Asynchronous pub/sub mechanism for publishing domain events.

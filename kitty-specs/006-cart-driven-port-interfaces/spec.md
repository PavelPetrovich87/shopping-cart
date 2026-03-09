# Specification: Cart Driven Port Interfaces

**Feature**: 006-cart-driven-port-interfaces
**Mission**: software-dev
**Status**: Draft
**Target Branch**: `main`

## Executive Summary

Define the core driven port interfaces for the Cart feature in accordance with the Hexagonal Architecture. These interfaces act as contracts that the application layer uses to interact with infrastructure and other domain contexts (Inventory and Pricing).

## User Scenarios

### Scenario 1: Cart Persistence (Repository)
As a developer, I need a standard way to retrieve and save the Cart aggregate regardless of the underlying storage (e.g., local state, local storage, or a remote API). The repository should allow me to fetch a specific cart by its identifier and save changes synchronously to match the local state management pattern.

### Scenario 2: Stock Validation (Inventory Service)
As a developer implementing the "Add Item to Cart" use case, I need a way to check if a specific product variant has enough stock before adding it to the cart. The interface should return a result that clearly indicates if the stock is available or if there's an error (e.g., "Out of Stock").

### Scenario 3: Coupon Validation (Pricing Service)
As a developer implementing the "Apply Coupon" use case, I need a way to validate a coupon code and calculate the discount amount. The interface should return results that provide the discount details or descriptive error messages (e.g., "Coupon Expired") to show to the user.

## Functional Requirements

### FR-01: Cart Repository Interface (`ICartRepository`)
- Must provide a `getCart(id: string): Cart` method to retrieve a Cart aggregate by its ID.
- Must provide a `saveCart(cart: Cart): void` method to persist the current state of the Cart aggregate.
- Both methods must be synchronous, as they are intended to be backed by local state (e.g., Zustand).

### FR-02: Inventory Service Port (`IInventoryService`)
- Must provide a `checkStockAvailability(skuId: string, quantity: number): Promise<StockResult>` method.
- `StockResult` must follow a Result pattern, returning either success data (available/unavailable) or a domain error.

### FR-03: Pricing Service Port (`IPricingService`)
- Must provide a `validateCoupon(code: string): Promise<CouponResult>` method.
- Must provide a `calculateDiscount(code: string, subtotal: Money): Promise<MoneyResult>` method.
- Both methods must be asynchronous and return results with descriptive domain error codes/messages where applicable.

### FR-04: Domain Leak Prevention
- All port interfaces must use domain types (e.g., `Cart`, `Money`, `StockResult`, `CouponResult`) for inputs and outputs.
- No infrastructure-specific types (e.g., HTTP responses, database models) should be exposed in these interfaces.

## Success Criteria

1. Interfaces are defined in `src/features/cart/application/ports/`.
2. `ICartRepository` methods are synchronous and accept a Cart ID.
3. `IInventoryService` and `IPricingService` use a `Result` object for error handling.
4. All port signatures are strictly typed and use domain entities/value objects.
5. Unit tests for use cases can successfully mock these interfaces to verify logic without infrastructure dependencies.

## Key Entities

- `ICartRepository`: Contract for Cart persistence.
- `IInventoryService`: Port for stock availability checks.
- `IPricingService`: Port for coupon validation and discount calculation.
- `StockResult`: Result object containing stock status or domain error.
- `CouponResult`: Result object containing coupon validity or domain error.
- `MoneyResult`: Result object containing discount amount or domain error.

## Assumptions

- The `Cart` aggregate and `Money` value object are already defined (T-004 and T-001).
- "Synchronous" repository methods are acceptable because the initial implementation uses Zustand/Local State.
- `Result` objects will be simple objects or a standard Result/Either type common in the project.

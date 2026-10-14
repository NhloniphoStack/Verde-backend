# Verde — Backend

The backend for Verde, a small e-commerce application for managing products, shopping carts, and customer orders.

## Features

- **Products** — Manage product information and availability.
- **Shopping cart** — Handle products selected for purchase.
- **Authentication** — Support authenticated users.
- **Checkout** — Process orders from the shopping cart.
- **Order management** — Store orders and their associated items.
- **Stock management** — Track product stock and prevent orders from exceeding available inventory.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Hosted on Neon)

## Getting Started

### Prerequisites

- Node.js
- The database used by the application

### Installation

Clone the repository and navigate to the backend directory.

```bash
npm install
```

### Environment Variables

Create a `.env` file in the backend root directory and configure the environment variables required by the application.

Do not commit your `.env` file or expose sensitive credentials.

### Running the Server

Use the development or start script defined in `package.json`.

```bash
npm run dev
```

## Database

The database includes product, order, and order-item data. Product stock is tracked to support inventory management during checkout.

Orders and their associated items should remain consistent when a checkout operation succeeds or fails.

## API

The backend exposes API endpoints for the application's e-commerce functionality.

Refer to the implemented routes and controllers for the available endpoints, request formats, and response structures.

## Project Structure

The project is organized around its backend responsibilities, such as routes, controllers, database access, and application configuration, according to the existing implementation.

## Development Notes

- Validate incoming request data.
- Calculate order totals on the server.
- Verify product availability before confirming an order.
- Keep order creation and stock updates consistent.
- Keep sensitive credentials in environment variables.

---

**Verde** — E-commerce backend.
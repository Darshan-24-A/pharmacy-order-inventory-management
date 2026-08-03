# Pharmacy Order and Inventory Management System

A Node.js-based pharmacy management system for handling medicines, inventory updates, orders, and low-stock alerts. The backend is built with Express, PostgreSQL, Redis, and Socket.IO to support real-time alerts and efficient inventory tracking.

## How the system works

The application follows a simple layered architecture:

- Frontend: a lightweight web interface that interacts with the backend APIs.
- Backend: Express server serves REST APIs for medicines, orders, and alerts.
- Services: contain the business logic for adding medicines, placing orders, and checking stock.
- Repositories: communicate with the PostgreSQL database.
- Redis: caches medicine data to improve repeated reads.
- Socket.IO: sends real-time low-stock alerts to connected clients.

### Main modules

- Medicines: add, view, and update stock levels.
- Orders: place orders and reduce inventory automatically.
- Alerts: detect medicines below their reorder level.
- Caching: Redis stores the medicine list for faster access.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pharmacy-order-inventory-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following values:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=pharmacy_db
   REDIS_URL=redis://localhost:6379
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at:
- http://localhost:3000/

## Database connection

This project uses PostgreSQL as the main database.

### PostgreSQL setup

1. Install PostgreSQL and create a database named `pharmacy_db`.
2. Make sure the database user and password in your `.env` file match your PostgreSQL credentials.
3. The backend connects using the settings from the `src/config/db.js` file.

Example connection details:
- Host: `localhost`
- Port: `5432`
- Database: `pharmacy_db`
- User: `postgres`
- Password: your configured password

If the connection fails, check:
- PostgreSQL is running
- The database name exists
- The username/password are correct
- The `DB_HOST` and `DB_PORT` values are valid

### Redis setup

Redis is used for caching medicine data.

1. Install and start Redis locally.
2. Ensure `REDIS_URL` points to your Redis server.

If Redis is not running, the app may fail to start or may log connection errors.

## API overview

### Medicines
- `POST /api/medicines` - add a new medicine
- `GET /api/medicines` - get all medicines with stock information
- `PUT /api/medicines/:id` - update inventory stock

### Orders
- `POST /api/orders` - place an order
- `GET /api/orders` - list all orders
- `GET /api/orders/:id` - get specific order details

### Alerts
- `GET /api/alerts/low-stock` - get medicines that are below reorder level

## Upcoming AI recommendation feature

An AI-based medicine recommendation module is planned for a future update.

### Planned capabilities

- Recommend medicines based on stock trends and order history
- Suggest reorder quantities before stock runs low
- Highlight fast-moving medicines and slow-moving items
- Provide intelligent insights for inventory planning

### Expected approach

The future version may use:
- historical sales and inventory data from PostgreSQL
- Redis for fast access to recent stock information
- an AI/ML model or LLM-based service to generate practical recommendations

This feature will help pharmacies reduce stockouts, improve purchasing decisions, and optimize inventory planning.

## Notes

- The project currently uses a backend-first structure and is designed to be extended with a more advanced frontend and AI-powered analytics later.
- For local development, make sure both PostgreSQL and Redis are available before starting the server.

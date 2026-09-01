# E-Commerce API Route Specifications

## 📦 PRODUCTS
* **GET** `/api/v1/products` - List products with pagination and category filtering
* **GET** `/api/v1/products/:id` - Retrieve single product details by ID
* **POST** `/api/v1/products` - Create a new product (Admin)
* **PUT** `/api/v1/products/:id` - Update existing product details (Admin)
* **DELETE** `/api/v1/products/:id` - Delete product by ID (Admin)

---

## 🗂 CATEGORIES
* **GET** `/api/v1/categories` - List all hierarchical product categories
* **GET** `/api/v1/categories/:id` - Get category details by ID
* **POST** `/api/v1/categories` - Create new category (Admin)
* **PUT** `/api/v1/categories/:id` - Update category details (Admin)
* **DELETE** `/api/v1/categories/:id` - Delete category (Admin)

---

## 🛒 ORDERS
* **GET** `/api/v1/orders` - List customer orders (Auth required)
* **GET** `/api/v1/orders/:id` - Get order by ID with line items and tracking (Auth required)
* **POST** `/api/v1/orders` - Place / checkout new order from cart (Auth required)
* **PATCH** `/api/v1/orders/:id/status` - Update order status (Admin / Staff)
* **POST** `/api/v1/orders/:id/cancel` - Cancel active order (Auth required)

---

## 👤 CUSTOMERS
* **GET** `/api/v1/customers/profile` - Get current customer profile (Auth required)
* **PUT** `/api/v1/customers/profile` - Update customer profile details (Auth required)
* **GET** `/api/v1/customers/addresses` - List saved shipping and billing addresses (Auth required)
* **POST** `/api/v1/customers/addresses` - Add new customer address (Auth required)
* **DELETE** `/api/v1/customers/addresses/:id` - Remove saved customer address (Auth required)

---

## 🔐 AUTHENTICATION
* **POST** `/api/v1/auth/register` - Register new customer account
* **POST** `/api/v1/auth/login` - Authenticate customer credentials and return Bearer JWT token
* **POST** `/api/v1/auth/refresh` - Refresh active access token
* **POST** `/api/v1/auth/logout` - Invalidate active session and blacklist token
* **GET** `/api/v1/auth/me` - Get current authenticated user info (Auth required)

---

## 🛍 SHOPPING CART
* **GET** `/api/v1/cart` - Get current user active shopping cart & items (Auth required)
* **POST** `/api/v1/cart/items` - Add product item to cart (Auth required)
* **PUT** `/api/v1/cart/items/:itemId` - Update cart item quantity (Auth required)
* **DELETE** `/api/v1/cart/items/:itemId` - Remove item from cart (Auth required)
* **DELETE** `/api/v1/cart` - Clear entire cart (Auth required)

---

## 🔎 PRODUCT SEARCH
* **GET** `/api/v1/search` - Full-text search with filtering (price, category, rating) and sorting
* **GET** `/api/v1/search/suggestions` - Auto-complete search query suggestions

---

## 📊 INVENTORY / STOCK
* **GET** `/api/v1/inventory/:productId` - Get real-time stock level and status for product
* **PATCH** `/api/v1/inventory/:productId` - Update or adjust inventory quantity (Admin)
* **GET** `/api/v1/inventory/low-stock` - List low stock and out-of-stock items (Admin)

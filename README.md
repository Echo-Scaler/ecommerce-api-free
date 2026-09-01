# 🛒 E-Commerce API Documentation & Interactive API Tester

A modern, high-performance developer documentation platform and interactive testing suite for E-Commerce REST APIs built with React 18, Vite, TypeScript, and Lucide icons.

![E-Commerce API Docs](https://images.unsplash.com/photo-1557821552-17105176677c?w=1200)

---

## 🌟 Core Features

- 📑 **Comprehensive REST Catalog**: 8 complete e-commerce modules with 30 production-ready endpoints.
- ⚡ **Interactive API Tester**: Live request builder with automatic parameter binding, custom header injection, and JSON body editor.
- 🔐 **Bearer Authentication Manager**: Secure token management with preset tokens (Admin, Customer, Guest) and token masking.
- 📊 **Real-Time Response Viewer**: Visual HTTP status indicators, response duration latency timer, payload size metrics, and copy/download actions.
- 🛠 **Diagnostic Error Classification**: Intelligent explanations for `400`, `401`, `403`, `404`, `422`, `500`, Network Errors, and Timeout aborts.
- 💻 **Dynamic Code Generator**: Instant snippet generation for **cURL**, **Fetch (JS/TS)**, and **Axios** with live token injection.
- 🔍 **Instant Search & Filtering**: Multi-field search across endpoints, paths, HTTP verbs, and module categories with `⌘K` shortcut.
- 📱 **Fully Responsive Layout**: Seamless UX across desktop, tablet, and mobile with sliding drawer navigation.

---

## 📦 API Modules & Endpoint Catalog

| Module | Endpoints Count | Key Operations |
| :--- | :--- | :--- |
| **1. 📦 Products** | 5 Endpoints | List Products, Product Details, Create Product (Admin), Update (Admin), Delete (Admin) |
| **2. 🗂 Categories** | 5 Endpoints | Hierarchy Tree, Category Detail, Create Category, Update, Delete |
| **3. 🛒 Orders** | 5 Endpoints | List Orders, Order Details, Create Checkout, Status Transition, Cancel Order |
| **4. 👤 Customers** | 5 Endpoints | Get Profile, Update Profile, Address Book, Add Address, Delete Address |
| **5. 🔐 Authentication** | 5 Endpoints | Customer Register, Login JWT, Token Refresh, Logout Session, Session Identity |
| **6. 🛍 Shopping Cart** | 5 Endpoints | Active Cart, Add Item, Update Quantity, Remove Item, Clear Cart |
| **7. 🔎 Product Search** | 2 Endpoints | Full-Text Search with Price Filters & Sorting, Auto-Complete Suggestions |
| **8. 📊 Inventory / Stock**| 3 Endpoints | Stock Level Check, Stock Adjustment (Admin), Low-Stock Audit Alerts |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```

### 3. Run Automated Quality & API Module Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 🛡 Security & Best Practices

- **Zero Secrets Committed**: Strict `.gitignore` policy preventing `.env` and credential exposure.
- **Strict TypeScript Validation**: Full type safety with zero lint or compilation warnings.
- **Centralized API Client**: Reusable architecture decoupled via `src/lib/api-client.ts`.

---

## 📄 License
MIT License. Free and open-source for commercial and personal use.

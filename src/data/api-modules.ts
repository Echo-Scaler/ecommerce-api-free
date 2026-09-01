import { ApiModule } from '../types/api';

export const API_MODULES: ApiModule[] = [
  {
    id: 'products',
    name: 'Products',
    iconName: 'Package',
    description: 'Manage catalog products, stock items, pricing, and variants.',
    endpoints: [
      {
        id: 'get-products',
        moduleId: 'products',
        name: 'List Products',
        summary: 'Retrieve paginated list of catalog products with optional filtering',
        description: 'Returns a list of products with support for pagination, category filtering, and sorting.',
        method: 'GET',
        path: '/api/v1/products',
        authRequired: false,
        parameters: [
          { name: 'page', type: 'number', location: 'query', required: false, defaultValue: 1, description: 'Page number for pagination', example: 1 },
          { name: 'limit', type: 'number', location: 'query', required: false, defaultValue: 20, description: 'Number of items per page', example: 20 },
          { name: 'category_id', type: 'string', location: 'query', required: false, description: 'Filter products by category UUID', example: 'cat_electronics' },
          { name: 'sort', type: 'string', location: 'query', required: false, defaultValue: 'created_at:desc', description: 'Sort by field and order', example: 'price:asc' }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Products successfully retrieved',
            body: {
              success: true,
              data: [
                {
                  id: 'prod_901a8f',
                  name: 'Sony WH-1000XM5 Wireless Headphones',
                  sku: 'SNY-WH1000XM5-BLK',
                  price: 399.99,
                  currency: 'USD',
                  category: { id: 'cat_electronics', name: 'Electronics' },
                  stock: 45,
                  status: 'active',
                  images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
                  created_at: '2026-01-15T08:30:00Z'
                },
                {
                  id: 'prod_902b7e',
                  name: 'Mechanical Gaming Keyboard RGB',
                  sku: 'KBD-MECH-RGB-01',
                  price: 129.50,
                  currency: 'USD',
                  category: { id: 'cat_accessories', name: 'Computer Accessories' },
                  stock: 120,
                  status: 'active',
                  images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'],
                  created_at: '2026-01-20T11:15:00Z'
                }
              ],
              pagination: { total: 42, page: 1, limit: 20, totalPages: 3 }
            }
          }
        ],
        tags: ['Catalog', 'Public']
      },
      {
        id: 'get-product-by-id',
        moduleId: 'products',
        name: 'Get Product by ID',
        summary: 'Retrieve detailed information for a single product',
        description: 'Fetches comprehensive product specifications, pricing tiers, and real-time inventory.',
        method: 'GET',
        path: '/api/v1/products/:id',
        authRequired: false,
        parameters: [
          { name: 'id', type: 'string', location: 'path', required: true, description: 'Unique product ID or slug', example: 'prod_901a8f' }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Product details retrieved successfully',
            body: {
              success: true,
              data: {
                id: 'prod_901a8f',
                name: 'Sony WH-1000XM5 Wireless Headphones',
                sku: 'SNY-WH1000XM5-BLK',
                description: 'Industry-leading noise cancellation with two processors and 8 microphones.',
                price: 399.99,
                compare_at_price: 449.99,
                currency: 'USD',
                stock: 45,
                weight_grams: 250,
                dimensions: { length: 22.5, width: 17.5, height: 7.2 },
                category: { id: 'cat_electronics', name: 'Electronics' },
                tags: ['audio', 'wireless', 'bluetooth', 'noise-cancelling'],
                created_at: '2026-01-15T08:30:00Z'
              }
            }
          },
          {
            statusCode: 404,
            statusText: 'Not Found',
            description: 'Product does not exist',
            body: { success: false, error: 'Product with ID prod_901a8f not found' }
          }
        ],
        tags: ['Catalog', 'Public']
      },
      {
        id: 'create-product',
        moduleId: 'products',
        name: 'Create Product',
        summary: 'Create a new product item in the catalog (Admin only)',
        description: 'Creates a new product record with SKU, initial stock, and category association.',
        method: 'POST',
        path: '/api/v1/products',
        authRequired: true,
        roles: ['admin'],
        parameters: [],
        requestBodySchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Product title', required: true, example: 'Apple MacBook Pro 16"' },
            sku: { type: 'string', description: 'Unique Stock Keeping Unit', required: true, example: 'MBP16-M4-MAX-32GB' },
            price: { type: 'number', description: 'Selling price', required: true, example: 2499.00 },
            category_id: { type: 'string', description: 'Category identifier', required: true, example: 'cat_laptops' },
            stock: { type: 'number', description: 'Initial stock level', required: true, example: 25 },
            description: { type: 'string', description: 'Detailed product description', required: false, example: 'M4 Max chip with 36GB unified memory.' }
          }
        },
        defaultRequestBody: {
          name: 'Apple MacBook Pro 16" M4 Max',
          sku: 'MBP16-M4-MAX-32GB',
          price: 2499.00,
          category_id: 'cat_laptops',
          stock: 25,
          description: 'High-performance laptop for demanding professional workflows.'
        },
        responseExamples: [
          {
            statusCode: 201,
            statusText: 'Created',
            description: 'Product successfully created',
            body: {
              success: true,
              data: {
                id: 'prod_8829cc',
                name: 'Apple MacBook Pro 16" M4 Max',
                sku: 'MBP16-M4-MAX-32GB',
                price: 2499.00,
                stock: 25,
                created_at: '2026-09-01T14:20:00Z'
              }
            }
          }
        ],
        tags: ['Admin', 'Products']
      },
      {
        id: 'update-product',
        moduleId: 'products',
        name: 'Update Product',
        summary: 'Update existing product properties (Admin only)',
        description: 'Modifies attributes of an existing product such as title, price, or description.',
        method: 'PUT',
        path: '/api/v1/products/:id',
        authRequired: true,
        roles: ['admin'],
        parameters: [
          { name: 'id', type: 'string', location: 'path', required: true, description: 'Product ID to update', example: 'prod_901a8f' }
        ],
        defaultRequestBody: {
          price: 379.99,
          stock: 60,
          description: 'Updated price with promotional discount.'
        },
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Product updated successfully',
            body: {
              success: true,
              message: 'Product updated successfully',
              data: { id: 'prod_901a8f', price: 379.99, stock: 60, updated_at: '2026-09-01T14:25:00Z' }
            }
          }
        ],
        tags: ['Admin', 'Products']
      },
      {
        id: 'delete-product',
        moduleId: 'products',
        name: 'Delete Product',
        summary: 'Archive or permanently remove a product (Admin only)',
        description: 'Soft-deletes or removes a product from the active catalog.',
        method: 'DELETE',
        path: '/api/v1/products/:id',
        authRequired: true,
        roles: ['admin'],
        parameters: [
          { name: 'id', type: 'string', location: 'path', required: true, description: 'Product ID to delete', example: 'prod_901a8f' }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Product deleted',
            body: { success: true, message: 'Product prod_901a8f successfully deleted' }
          }
        ],
        tags: ['Admin', 'Products']
      }
    ]
  },
  {
    id: 'categories',
    name: 'Categories',
    iconName: 'FolderTree',
    description: 'Organize catalog taxonomy, nested categories, and classifications.',
    endpoints: [
      {
        id: 'get-categories',
        moduleId: 'categories',
        name: 'List Categories',
        summary: 'Retrieve full category taxonomy tree',
        description: 'Returns all root categories and their subcategory hierarchies.',
        method: 'GET',
        path: '/api/v1/categories',
        authRequired: false,
        parameters: [],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Category hierarchy tree',
            body: {
              success: true,
              data: [
                {
                  id: 'cat_electronics',
                  name: 'Electronics',
                  slug: 'electronics',
                  productCount: 142,
                  children: [
                    { id: 'cat_audio', name: 'Audio & Headphones', slug: 'audio', productCount: 48 },
                    { id: 'cat_laptops', name: 'Laptops & PCs', slug: 'laptops', productCount: 64 }
                  ]
                },
                {
                  id: 'cat_fashion',
                  name: 'Fashion & Apparel',
                  slug: 'fashion',
                  productCount: 310,
                  children: []
                }
              ]
            }
          }
        ],
        tags: ['Catalog', 'Categories']
      },
      {
        id: 'get-category-by-id',
        moduleId: 'categories',
        name: 'Get Category by ID',
        summary: 'Get details and breadcrumbs for a single category',
        description: 'Returns category metadata, parent reference, and active subcategories.',
        method: 'GET',
        path: '/api/v1/categories/:id',
        authRequired: false,
        parameters: [
          { name: 'id', type: 'string', location: 'path', required: true, description: 'Category identifier or slug', example: 'cat_electronics' }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Category details found',
            body: {
              success: true,
              data: {
                id: 'cat_electronics',
                name: 'Electronics',
                slug: 'electronics',
                description: 'Gadgets, computers, audio equipment and consumer tech.',
                imageUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500',
                isActive: true
              }
            }
          }
        ],
        tags: ['Catalog', 'Categories']
      },
      {
        id: 'create-category',
        moduleId: 'categories',
        name: 'Create Category',
        summary: 'Create a new category node (Admin only)',
        description: 'Adds a new category to the navigation taxonomy.',
        method: 'POST',
        path: '/api/v1/categories',
        authRequired: true,
        roles: ['admin'],
        parameters: [],
        defaultRequestBody: {
          name: 'Smart Home Devices',
          slug: 'smart-home',
          description: 'Connected IoT devices, security cameras, and home automation.',
          parent_id: 'cat_electronics'
        },
        responseExamples: [
          {
            statusCode: 201,
            statusText: 'Created',
            description: 'Category created',
            body: {
              success: true,
              data: { id: 'cat_smarthome_99', name: 'Smart Home Devices', slug: 'smart-home', created_at: '2026-09-01T14:30:00Z' }
            }
          }
        ],
        tags: ['Admin', 'Categories']
      },
      {
        id: 'update-category',
        moduleId: 'categories',
        name: 'Update Category',
        summary: 'Update category name or parent (Admin only)',
        description: 'Updates category meta title, description, or parent relationship.',
        method: 'PUT',
        path: '/api/v1/categories/:id',
        authRequired: true,
        roles: ['admin'],
        parameters: [
          { name: 'id', type: 'string', location: 'path', required: true, description: 'Category ID', example: 'cat_electronics' }
        ],
        defaultRequestBody: {
          name: 'Consumer Electronics & Gadgets',
          description: 'Updated comprehensive electronics collection.'
        },
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Category updated',
            body: { success: true, message: 'Category updated successfully' }
          }
        ],
        tags: ['Admin', 'Categories']
      },
      {
        id: 'delete-category',
        moduleId: 'categories',
        name: 'Delete Category',
        summary: 'Remove category from catalog (Admin only)',
        description: 'Deletes a category node if it contains no active child products.',
        method: 'DELETE',
        path: '/api/v1/categories/:id',
        authRequired: true,
        roles: ['admin'],
        parameters: [
          { name: 'id', type: 'string', location: 'path', required: true, description: 'Category ID', example: 'cat_smarthome_99' }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Category deleted',
            body: { success: true, message: 'Category cat_smarthome_99 removed' }
          }
        ],
        tags: ['Admin', 'Categories']
      }
    ]
  },
  {
    id: 'orders',
    name: 'Orders',
    iconName: 'ShoppingCart',
    description: 'Process customer checkout, order fulfillment, and status tracking.',
    endpoints: [
      {
        id: 'get-orders',
        moduleId: 'orders',
        name: 'List Orders',
        summary: 'List orders for authenticated customer or all orders (Admin)',
        description: 'Returns customer order history sorted by most recent order date.',
        method: 'GET',
        path: '/api/v1/orders',
        authRequired: true,
        parameters: [
          { name: 'status', type: 'string', location: 'query', required: false, description: 'Filter by status (pending, processing, completed, cancelled)', example: 'processing' },
          { name: 'limit', type: 'number', location: 'query', required: false, defaultValue: 10, description: 'Page limit', example: 10 }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'List of orders returned',
            body: {
              success: true,
              data: [
                {
                  id: 'ord_9281a',
                  order_number: 'ORD-2026-8821',
                  status: 'processing',
                  total_amount: 529.49,
                  currency: 'USD',
                  items_count: 2,
                  payment_status: 'paid',
                  shipping_status: 'preparing',
                  created_at: '2026-08-30T10:14:22Z'
                }
              ]
            }
          }
        ],
        tags: ['Orders', 'Customer']
      },
      {
        id: 'get-order-by-id',
        moduleId: 'orders',
        name: 'Get Order by ID',
        summary: 'Retrieve complete order details and line items',
        description: 'Fetches line items, shipping address, payment method, and tracking number.',
        method: 'GET',
        path: '/api/v1/orders/:id',
        authRequired: true,
        parameters: [
          { name: 'id', type: 'string', location: 'path', required: true, description: 'Order ID or order number', example: 'ord_9281a' }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Order details found',
            body: {
              success: true,
              data: {
                id: 'ord_9281a',
                order_number: 'ORD-2026-8821',
                customer_id: 'cust_4401',
                status: 'processing',
                items: [
                  { product_id: 'prod_901a8f', name: 'Sony WH-1000XM5', quantity: 1, unit_price: 399.99, subtotal: 399.99 },
                  { product_id: 'prod_902b7e', name: 'Mechanical Gaming Keyboard RGB', quantity: 1, unit_price: 129.50, subtotal: 129.50 }
                ],
                subtotal: 529.49,
                tax: 0.00,
                shipping_fee: 0.00,
                total_amount: 529.49,
                shipping_address: {
                  recipient: 'Alex Mercer',
                  street: '742 Evergreen Terrace',
                  city: 'Springfield',
                  state: 'OR',
                  zip: '97477',
                  country: 'US'
                },
                tracking_code: 'TRK-USPS-99827110'
              }
            }
          }
        ],
        tags: ['Orders', 'Customer']
      },
      {
        id: 'create-order',
        moduleId: 'orders',
        name: 'Create Order (Checkout)',
        summary: 'Place a new order with items, shipping, and payment intent',
        description: 'Converts active cart items or supplied line items into a placed order.',
        method: 'POST',
        path: '/api/v1/orders',
        authRequired: true,
        parameters: [],
        defaultRequestBody: {
          shipping_address_id: 'addr_9910',
          payment_method: 'card',
          items: [
            { product_id: 'prod_901a8f', quantity: 1 }
          ],
          customer_notes: 'Please leave package at front porch.'
        },
        responseExamples: [
          {
            statusCode: 201,
            statusText: 'Created',
            description: 'Order placed successfully',
            body: {
              success: true,
              message: 'Order created successfully',
              data: {
                order_id: 'ord_9281a',
                order_number: 'ORD-2026-8821',
                total_amount: 399.99,
                status: 'pending_payment',
                created_at: '2026-09-01T14:40:00Z'
              }
            }
          }
        ],
        tags: ['Orders', 'Checkout']
      },
      {
        id: 'update-order-status',
        moduleId: 'orders',
        name: 'Update Order Status',
        summary: 'Update workflow state of an order (Admin / Staff)',
        description: 'Transitions order between states: pending, processing, shipped, delivered, cancelled.',
        method: 'PATCH',
        path: '/api/v1/orders/:id/status',
        authRequired: true,
        roles: ['admin'],
        parameters: [
          { name: 'id', type: 'string', location: 'path', required: true, description: 'Order ID', example: 'ord_9281a' }
        ],
        defaultRequestBody: {
          status: 'shipped',
          tracking_code: 'TRK-FEDEX-8812930',
          notify_customer: true
        },
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Status updated',
            body: {
              success: true,
              message: 'Order ord_9281a status updated to shipped'
            }
          }
        ],
        tags: ['Orders', 'Admin']
      },
      {
        id: 'cancel-order',
        moduleId: 'orders',
        name: 'Cancel Order',
        summary: 'Cancel an unpaid or processing order',
        description: 'Cancels order and returns reserved inventory to available stock.',
        method: 'POST',
        path: '/api/v1/orders/:id/cancel',
        authRequired: true,
        parameters: [
          { name: 'id', type: 'string', location: 'path', required: true, description: 'Order ID', example: 'ord_9281a' }
        ],
        defaultRequestBody: {
          reason: 'Customer requested cancellation prior to dispatch'
        },
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Order cancelled',
            body: { success: true, message: 'Order ord_9281a has been cancelled' }
          }
        ],
        tags: ['Orders', 'Customer']
      }
    ]
  },
  {
    id: 'customers',
    name: 'Customers',
    iconName: 'User',
    description: 'Manage customer accounts, profile details, and address book.',
    endpoints: [
      {
        id: 'get-customer-profile',
        moduleId: 'customers',
        name: 'Get Customer Profile',
        summary: 'Get current customer profile details',
        description: 'Returns profile details for the authenticated customer based on Bearer token.',
        method: 'GET',
        path: '/api/v1/customers/profile',
        authRequired: true,
        parameters: [],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Customer profile details',
            body: {
              success: true,
              data: {
                id: 'cust_4401',
                email: 'alex.mercer@example.com',
                first_name: 'Alex',
                last_name: 'Mercer',
                phone: '+1-555-0199',
                is_email_verified: true,
                default_shipping_address_id: 'addr_9910',
                created_at: '2025-11-10T12:00:00Z'
              }
            }
          }
        ],
        tags: ['Customer', 'Profile']
      },
      {
        id: 'update-customer-profile',
        moduleId: 'customers',
        name: 'Update Customer Profile',
        summary: 'Update personal profile fields',
        description: 'Updates name, phone number, and preferences for authenticated user.',
        method: 'PUT',
        path: '/api/v1/customers/profile',
        authRequired: true,
        parameters: [],
        defaultRequestBody: {
          first_name: 'Alex',
          last_name: 'Mercer',
          phone: '+1-555-9876'
        },
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Profile updated',
            body: { success: true, message: 'Customer profile updated successfully' }
          }
        ],
        tags: ['Customer', 'Profile']
      },
      {
        id: 'get-customer-addresses',
        moduleId: 'customers',
        name: 'List Saved Addresses',
        summary: 'Get all saved addresses in customer address book',
        description: 'Returns list of shipping and billing addresses saved for fast checkout.',
        method: 'GET',
        path: '/api/v1/customers/addresses',
        authRequired: true,
        parameters: [],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Customer address book',
            body: {
              success: true,
              data: [
                {
                  id: 'addr_9910',
                  label: 'Home',
                  recipient_name: 'Alex Mercer',
                  street_line_1: '742 Evergreen Terrace',
                  street_line_2: 'Apt 4B',
                  city: 'Springfield',
                  state: 'OR',
                  postal_code: '97477',
                  country: 'US',
                  is_default: true
                }
              ]
            }
          }
        ],
        tags: ['Customer', 'Addresses']
      },
      {
        id: 'create-customer-address',
        moduleId: 'customers',
        name: 'Add Address',
        summary: 'Add a new shipping or billing address',
        description: 'Stores a new address in customer profile.',
        method: 'POST',
        path: '/api/v1/customers/addresses',
        authRequired: true,
        parameters: [],
        defaultRequestBody: {
          label: 'Office',
          recipient_name: 'Alex Mercer',
          street_line_1: '100 Silicon Ave',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94107',
          country: 'US',
          is_default: false
        },
        responseExamples: [
          {
            statusCode: 201,
            statusText: 'Created',
            description: 'Address added',
            body: {
              success: true,
              data: { id: 'addr_9911', label: 'Office', is_default: false }
            }
          }
        ],
        tags: ['Customer', 'Addresses']
      },
      {
        id: 'delete-customer-address',
        moduleId: 'customers',
        name: 'Delete Address',
        summary: 'Remove an address from address book',
        description: 'Deletes specified address record from customer account.',
        method: 'DELETE',
        path: '/api/v1/customers/addresses/:id',
        authRequired: true,
        parameters: [
          { name: 'id', type: 'string', location: 'path', required: true, description: 'Address ID', example: 'addr_9911' }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Address deleted',
            body: { success: true, message: 'Address removed successfully' }
          }
        ],
        tags: ['Customer', 'Addresses']
      }
    ]
  },
  {
    id: 'auth',
    name: 'Authentication',
    iconName: 'Lock',
    description: 'User registration, login, token refresh, and session control.',
    endpoints: [
      {
        id: 'auth-register',
        moduleId: 'auth',
        name: 'Register Customer',
        summary: 'Register a new customer account',
        description: 'Creates customer account and returns initial authentication credentials.',
        method: 'POST',
        path: '/api/v1/auth/register',
        authRequired: false,
        parameters: [],
        defaultRequestBody: {
          email: 'alex.mercer@example.com',
          password: 'SuperSecurePassword!2026',
          first_name: 'Alex',
          last_name: 'Mercer'
        },
        responseExamples: [
          {
            statusCode: 201,
            statusText: 'Created',
            description: 'Account registered successfully',
            body: {
              success: true,
              message: 'Account created successfully',
              data: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjdXN0XzQ0MDEiLCJlbWFpbCI6ImFsZXgubWVyY2VyQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzg4MzAxMjAwLCJleHAiOjE3ODgzODc2MDB9.sample-token-sig',
                expiresIn: 86400,
                user: { id: 'cust_4401', email: 'alex.mercer@example.com', name: 'Alex Mercer' }
              }
            }
          }
        ],
        tags: ['Auth', 'Public']
      },
      {
        id: 'auth-login',
        moduleId: 'auth',
        name: 'Customer Login',
        summary: 'Authenticate with email and password to receive JWT token',
        description: 'Validates user credentials and issues a signed JSON Web Token (JWT).',
        method: 'POST',
        path: '/api/v1/auth/login',
        authRequired: false,
        parameters: [],
        defaultRequestBody: {
          email: 'alex.mercer@example.com',
          password: 'SuperSecurePassword!2026'
        },
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Authentication successful',
            body: {
              success: true,
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjdXN0XzQ0MDEiLCJlbWFpbCI6ImFsZXgubWVyY2VyQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzg4MzAxMjAwLCJleHAiOjE3ODgzODc2MDB9.sample-token-sig',
              tokenType: 'Bearer',
              expiresIn: 86400,
              user: { id: 'cust_4401', email: 'alex.mercer@example.com', name: 'Alex Mercer', role: 'customer' }
            }
          },
          {
            statusCode: 401,
            statusText: 'Unauthorized',
            description: 'Invalid email or password',
            body: { success: false, error: 'Invalid credentials provided' }
          }
        ],
        tags: ['Auth', 'Public']
      },
      {
        id: 'auth-refresh',
        moduleId: 'auth',
        name: 'Refresh Token',
        summary: 'Obtain a fresh JWT access token using active session',
        description: 'Extends authentication lifecycle without requiring user credentials re-entry.',
        method: 'POST',
        path: '/api/v1/auth/refresh',
        authRequired: true,
        parameters: [],
        defaultRequestBody: {},
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Token refreshed',
            body: {
              success: true,
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjdXN0XzQ0MDEiLCJlbWFpbCI6ImFsZXgubWVyY2VyQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzg4MzA1MjAwLCJleHAiOjE3ODgzOTE2MDB9.sample-token-refreshed',
              expiresIn: 86400
            }
          }
        ],
        tags: ['Auth', 'Token']
      },
      {
        id: 'auth-logout',
        moduleId: 'auth',
        name: 'Logout Session',
        summary: 'Invalidate current JWT access token and session',
        description: 'Blacklists current Bearer token on the server side.',
        method: 'POST',
        path: '/api/v1/auth/logout',
        authRequired: true,
        parameters: [],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Logged out',
            body: { success: true, message: 'Successfully logged out' }
          }
        ],
        tags: ['Auth', 'Session']
      },
      {
        id: 'auth-me',
        moduleId: 'auth',
        name: 'Get Current Session Info',
        summary: 'Verify token and retrieve active session identity',
        description: 'Decodes and verifies current Bearer token to return token claims and permissions.',
        method: 'GET',
        path: '/api/v1/auth/me',
        authRequired: true,
        parameters: [],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Active session info',
            body: {
              success: true,
              user: { id: 'cust_4401', email: 'alex.mercer@example.com', role: 'customer', authenticated: true }
            }
          }
        ],
        tags: ['Auth', 'Session']
      }
    ]
  },
  {
    id: 'cart',
    name: 'Shopping Cart',
    iconName: 'ShoppingBag',
    description: 'Manage active customer shopping cart, line items, and quantities.',
    endpoints: [
      {
        id: 'get-cart',
        moduleId: 'cart',
        name: 'Get Active Cart',
        summary: 'Retrieve current user shopping cart items and subtotals',
        description: 'Returns active cart items with current product pricing, discounts, and item count.',
        method: 'GET',
        path: '/api/v1/cart',
        authRequired: true,
        parameters: [],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Current shopping cart',
            body: {
              success: true,
              data: {
                id: 'cart_7719',
                items: [
                  {
                    item_id: 'item_101',
                    product_id: 'prod_901a8f',
                    name: 'Sony WH-1000XM5 Wireless Headphones',
                    price: 399.99,
                    quantity: 1,
                    subtotal: 399.99
                  }
                ],
                items_total_count: 1,
                subtotal: 399.99,
                estimated_tax: 0.00,
                estimated_shipping: 0.00,
                grand_total: 399.99
              }
            }
          }
        ],
        tags: ['Cart', 'Customer']
      },
      {
        id: 'add-cart-item',
        moduleId: 'cart',
        name: 'Add Item to Cart',
        summary: 'Add product SKU and quantity to active cart',
        description: 'Increments or creates a line item in customer shopping cart.',
        method: 'POST',
        path: '/api/v1/cart/items',
        authRequired: true,
        parameters: [],
        defaultRequestBody: {
          product_id: 'prod_902b7e',
          quantity: 2
        },
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Item added to cart',
            body: {
              success: true,
              message: 'Item added to cart',
              cart: { id: 'cart_7719', items_total_count: 3, grand_total: 658.99 }
            }
          }
        ],
        tags: ['Cart', 'Customer']
      },
      {
        id: 'update-cart-item',
        moduleId: 'cart',
        name: 'Update Item Quantity',
        summary: 'Change quantity for specific cart item',
        description: 'Updates unit quantity or removes item if quantity set to 0.',
        method: 'PUT',
        path: '/api/v1/cart/items/:itemId',
        authRequired: true,
        parameters: [
          { name: 'itemId', type: 'string', location: 'path', required: true, description: 'Cart Line Item ID', example: 'item_101' }
        ],
        defaultRequestBody: {
          quantity: 3
        },
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Quantity updated',
            body: { success: true, message: 'Item quantity updated to 3' }
          }
        ],
        tags: ['Cart', 'Customer']
      },
      {
        id: 'delete-cart-item',
        moduleId: 'cart',
        name: 'Remove Cart Item',
        summary: 'Delete single item line from cart',
        description: 'Removes item from shopping cart and recalculates totals.',
        method: 'DELETE',
        path: '/api/v1/cart/items/:itemId',
        authRequired: true,
        parameters: [
          { name: 'itemId', type: 'string', location: 'path', required: true, description: 'Cart item ID to remove', example: 'item_101' }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Item removed',
            body: { success: true, message: 'Item item_101 removed from cart' }
          }
        ],
        tags: ['Cart', 'Customer']
      },
      {
        id: 'clear-cart',
        moduleId: 'cart',
        name: 'Clear Cart',
        summary: 'Empty all items from current cart',
        description: 'Clears all items in customer active session cart.',
        method: 'DELETE',
        path: '/api/v1/cart',
        authRequired: true,
        parameters: [],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Cart emptied',
            body: { success: true, message: 'Shopping cart cleared' }
          }
        ],
        tags: ['Cart', 'Customer']
      }
    ]
  },
  {
    id: 'search',
    name: 'Product Search',
    iconName: 'Search',
    description: 'Full-text query search, faceted filters, and search suggestions.',
    endpoints: [
      {
        id: 'search-products',
        moduleId: 'search',
        name: 'Search Products',
        summary: 'Perform full-text search with filters and sorting',
        description: 'Searches product catalog matching keyword query, min/max price, category, and brand.',
        method: 'GET',
        path: '/api/v1/search',
        authRequired: false,
        parameters: [
          { name: 'q', type: 'string', location: 'query', required: true, description: 'Search keywords', example: 'wireless headphones' },
          { name: 'min_price', type: 'number', location: 'query', required: false, description: 'Minimum price filter', example: 100 },
          { name: 'max_price', type: 'number', location: 'query', required: false, description: 'Maximum price filter', example: 500 },
          { name: 'sort', type: 'string', location: 'query', required: false, defaultValue: 'relevance', description: 'Sort by relevance, price_asc, price_desc, newest', example: 'price_asc' }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Search results returned',
            body: {
              success: true,
              query: 'wireless headphones',
              total_results: 18,
              results: [
                {
                  id: 'prod_901a8f',
                  name: 'Sony WH-1000XM5 Wireless Headphones',
                  price: 399.99,
                  rating: 4.8,
                  reviews_count: 245,
                  match_score: 0.98
                }
              ]
            }
          }
        ],
        tags: ['Search', 'Public']
      },
      {
        id: 'search-suggestions',
        moduleId: 'search',
        name: 'Search Suggestions',
        summary: 'Get auto-complete keyword suggestions as user types',
        description: 'Returns real-time phrase and product name completions for search boxes.',
        method: 'GET',
        path: '/api/v1/search/suggestions',
        authRequired: false,
        parameters: [
          { name: 'q', type: 'string', location: 'query', required: true, description: 'Prefix query string', example: 'wire' }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Suggestions list',
            body: {
              success: true,
              query: 'wire',
              suggestions: [
                'wireless headphones',
                'wireless charger',
                'wireless mouse',
                'wired mechanical keyboard'
              ]
            }
          }
        ],
        tags: ['Search', 'Public']
      }
    ]
  },
  {
    id: 'inventory',
    name: 'Inventory / Stock',
    iconName: 'BarChart2',
    description: 'Track real-time stock levels, inventory audits, and low-stock alerts.',
    endpoints: [
      {
        id: 'get-inventory-by-product',
        moduleId: 'inventory',
        name: 'Get Product Stock Level',
        summary: 'Get real-time quantity and warehouse status for a product',
        description: 'Returns total inventory, reserved units in pending orders, and available stock.',
        method: 'GET',
        path: '/api/v1/inventory/:productId',
        authRequired: true,
        parameters: [
          { name: 'productId', type: 'string', location: 'path', required: true, description: 'Product ID or SKU', example: 'prod_901a8f' }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Stock status details',
            body: {
              success: true,
              data: {
                product_id: 'prod_901a8f',
                sku: 'SNY-WH1000XM5-BLK',
                total_stock: 45,
                reserved_stock: 3,
                available_stock: 42,
                warehouse_location: 'US-WEST-BAY-4',
                low_stock_threshold: 10,
                status: 'in_stock'
              }
            }
          }
        ],
        tags: ['Inventory', 'Stock']
      },
      {
        id: 'update-inventory-stock',
        moduleId: 'inventory',
        name: 'Adjust Stock Quantity',
        summary: 'Update or increment stock quantity for product (Admin)',
        description: 'Performs inventory adjustment operation (add, subtract, or set absolute count).',
        method: 'PATCH',
        path: '/api/v1/inventory/:productId',
        authRequired: true,
        roles: ['admin'],
        parameters: [
          { name: 'productId', type: 'string', location: 'path', required: true, description: 'Product ID', example: 'prod_901a8f' }
        ],
        defaultRequestBody: {
          adjustment_type: 'add',
          quantity: 50,
          reason: 'Restock shipment received from supplier'
        },
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Stock adjusted successfully',
            body: {
              success: true,
              message: 'Stock adjusted by +50 units',
              data: { product_id: 'prod_901a8f', previous_stock: 45, current_stock: 95 }
            }
          }
        ],
        tags: ['Inventory', 'Admin']
      },
      {
        id: 'get-low-stock-items',
        moduleId: 'inventory',
        name: 'List Low Stock Items',
        summary: 'Retrieve all items reaching reorder threshold (Admin)',
        description: 'Generates alert list of products whose available stock is below configured threshold.',
        method: 'GET',
        path: '/api/v1/inventory/low-stock',
        authRequired: true,
        roles: ['admin'],
        parameters: [
          { name: 'threshold', type: 'number', location: 'query', required: false, defaultValue: 10, description: 'Stock threshold filter', example: 10 }
        ],
        responseExamples: [
          {
            statusCode: 200,
            statusText: 'OK',
            description: 'Low stock items list',
            body: {
              success: true,
              count: 2,
              data: [
                { product_id: 'prod_103', name: '4K Ultra-Wide Monitor 34"', sku: 'MON-4K-34', available_stock: 3, threshold: 10, status: 'critical' },
                { product_id: 'prod_209', name: 'USB-C Multi-Port Hub', sku: 'HUB-USBC-10IN1', available_stock: 5, threshold: 10, status: 'low' }
              ]
            }
          }
        ],
        tags: ['Inventory', 'Admin']
      }
    ]
  }
];

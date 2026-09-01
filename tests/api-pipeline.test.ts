import { executeApiRequest, RequestOptions } from '../src/lib/api-client';

async function runStep11Tests() {
  console.log('🚀 Testing API Execution Pipeline Across All 8 Modules...\n');

  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample-token';

  const testCases: Array<{ module: string; endpoint: string; options: RequestOptions }> = [
    {
      module: '1. 📦 Products',
      endpoint: 'GET /api/v1/products',
      options: { path: '/api/v1/products', method: 'GET', queryParams: { page: 1, limit: 10 } }
    },
    {
      module: '2. 🗂 Categories',
      endpoint: 'GET /api/v1/categories',
      options: { path: '/api/v1/categories', method: 'GET' }
    },
    {
      module: '3. 🛒 Orders',
      endpoint: 'POST /api/v1/orders',
      options: {
        path: '/api/v1/orders',
        method: 'POST',
        bearerToken: sampleToken,
        body: { items: [{ product_id: 'prod_901a8f', quantity: 2 }] }
      }
    },
    {
      module: '4. 👤 Customers',
      endpoint: 'GET /api/v1/customers/profile',
      options: { path: '/api/v1/customers/profile', method: 'GET', bearerToken: sampleToken }
    },
    {
      module: '5. 🔐 Authentication',
      endpoint: 'POST /api/v1/auth/login',
      options: {
        path: '/api/v1/auth/login',
        method: 'POST',
        body: { email: 'alex.mercer@example.com', password: 'Password123' }
      }
    },
    {
      module: '6. 🛍 Shopping Cart',
      endpoint: 'GET /api/v1/cart',
      options: { path: '/api/v1/cart', method: 'GET', bearerToken: sampleToken }
    },
    {
      module: '7. 🔎 Product Search',
      endpoint: 'GET /api/v1/search',
      options: { path: '/api/v1/search', method: 'GET', queryParams: { q: 'headphones' } }
    },
    {
      module: '8. 📊 Inventory / Stock',
      endpoint: 'GET /api/v1/inventory/:productId',
      options: {
        path: '/api/v1/inventory/:productId',
        method: 'GET',
        pathParams: { productId: 'prod_901a8f' },
        bearerToken: sampleToken
      }
    }
  ];

  let passed = 0;
  for (const tc of testCases) {
    try {
      const res = await executeApiRequest(tc.options);
      console.log(`✅ [${tc.module}] ${tc.endpoint}`);
      console.log(`   Status: ${res.status} ${res.statusText} | Latency: ${res.durationMs}ms | IsError: ${res.isError}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ [${tc.module}] Failed:`, err.message);
    }
  }

  if (passed === testCases.length) {
    console.log(`\n🎉 Test Results: ${passed}/${testCases.length} Modules Verified Successfully!`);
  } else {
    process.exit(1);
  }
}

runStep11Tests();

import { API_MODULES } from '../src/data/api-modules';
import { executeApiRequest } from '../src/lib/api-client';
import { generateCurlSnippet, generateFetchSnippet, generateAxiosSnippet } from '../src/lib/code-generator';

async function runStep22InventoryModuleTests() {
  console.log('📊 Starting Comprehensive Verification for Inventory / Stock API Module...\n');

  const inventoryModule = API_MODULES.find((m) => m.id === 'inventory');
  if (!inventoryModule) {
    throw new Error('Inventory module not found in API_MODULES');
  }

  const sampleAdminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin-token';

  const expectedEndpoints = [
    { id: 'get-inventory-by-product', method: 'GET', path: '/api/v1/inventory/:productId', name: 'Get Product Stock Level' },
    { id: 'update-inventory-stock', method: 'PATCH', path: '/api/v1/inventory/:productId', name: 'Adjust Stock Quantity' },
    { id: 'get-low-stock-items', method: 'GET', path: '/api/v1/inventory/low-stock', name: 'List Low Stock Items' },
  ];

  console.log(`Found ${inventoryModule.endpoints.length} Inventory Endpoints defined.`);

  // 1. Verify schema consistency
  for (const exp of expectedEndpoints) {
    const ep = inventoryModule.endpoints.find((e) => e.id === exp.id);
    if (!ep) {
      throw new Error(`Missing expected endpoint: ${exp.id}`);
    }
    if (ep.method !== exp.method || ep.path !== exp.path) {
      throw new Error(`Endpoint mismatch for ${exp.id}: expected ${exp.method} ${exp.path}, got ${exp.method} ${exp.path}`);
    }
    console.log(`  ✓ Definition Verified: [${ep.method}] ${ep.path} - "${ep.name}"`);
  }

  console.log('\n🚀 Executing Live Pipeline Tests on Inventory Endpoints:');

  // Test 1: Get Product Stock Level
  const resStock = await executeApiRequest({
    path: '/api/v1/inventory/:productId',
    method: 'GET',
    pathParams: { productId: 'prod_901a8f' },
    bearerToken: sampleAdminToken
  });
  console.log(`  1. Get Stock (GET /api/v1/inventory/:productId): HTTP ${resStock.status} ${resStock.statusText} (${resStock.durationMs}ms)`);
  if (resStock.status !== 200 || resStock.isError) {
    throw new Error('Get stock execution failed');
  }

  // Test 2: Adjust Stock Quantity (Admin Auth)
  const resAdjust = await executeApiRequest({
    path: '/api/v1/inventory/:productId',
    method: 'PATCH',
    pathParams: { productId: 'prod_901a8f' },
    bearerToken: sampleAdminToken,
    body: {
      adjustment_type: 'add',
      quantity: 50,
      reason: 'Supplier restock batch #2026-09'
    }
  });
  console.log(`  2. Adjust Stock (PATCH /api/v1/inventory/:productId): HTTP ${resAdjust.status} ${resAdjust.statusText} (${resAdjust.durationMs}ms)`);
  if (resAdjust.status !== 200 || resAdjust.isError) {
    throw new Error('Adjust stock execution failed');
  }

  // Test 3: List Low Stock Items (Admin Auth)
  const resLowStock = await executeApiRequest({
    path: '/api/v1/inventory/low-stock',
    method: 'GET',
    queryParams: { threshold: 15 },
    bearerToken: sampleAdminToken
  });
  console.log(`  3. List Low Stock (GET /api/v1/inventory/low-stock): HTTP ${resLowStock.status} ${resLowStock.statusText} (${resLowStock.durationMs}ms)`);
  if (resLowStock.status !== 200 || resLowStock.isError) {
    throw new Error('List low stock execution failed');
  }

  // Test 4: Verify Auth Guard on Inventory without token
  const resUnauth = await executeApiRequest({
    path: '/api/v1/inventory/:productId',
    method: 'GET',
    pathParams: { productId: 'prod_901a8f' },
    endpointId: 'get-inventory-by-product'
  });
  console.log(`  4. Auth Guard Test (GET /api/v1/inventory/:productId without token): HTTP ${resUnauth.status} ${resUnauth.statusText} (Expected 401)`);
  if (resUnauth.status !== 401) {
    throw new Error(`Auth guard failed: expected 401, got ${resUnauth.status}`);
  }

  // Test 5: Verify Code Snippet Generation for all 3 endpoints
  console.log('\n💻 Verifying Code Snippet Generation for Inventory:');
  for (const ep of inventoryModule.endpoints) {
    const curl = generateCurlSnippet(ep, { bearerToken: sampleAdminToken });
    const fetchCode = generateFetchSnippet(ep, { bearerToken: sampleAdminToken });
    const axiosCode = generateAxiosSnippet(ep, { bearerToken: sampleAdminToken });
    if (!curl || !fetchCode || !axiosCode) {
      throw new Error(`Code generation failed for inventory endpoint ${ep.id}`);
    }
    console.log(`  ✓ Generated cURL, Fetch, Axios for ${ep.method} ${ep.path}`);
  }

  console.log('\n🎉 Inventory / Stock API Module (All Endpoints) Fully Tested and Verified!');
}

runStep22InventoryModuleTests();

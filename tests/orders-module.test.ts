import { API_MODULES } from '../src/data/api-modules';
import { executeApiRequest } from '../src/lib/api-client';
import { generateCurlSnippet, generateFetchSnippet, generateAxiosSnippet } from '../src/lib/code-generator';

async function runStep17OrdersModuleTests() {
  console.log('🛒 Starting Comprehensive Verification for Orders API Module...\n');

  const ordersModule = API_MODULES.find((m) => m.id === 'orders');
  if (!ordersModule) {
    throw new Error('Orders module not found in API_MODULES');
  }

  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.customer-token';
  const sampleAdminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin-token';

  const expectedEndpoints = [
    { id: 'get-orders', method: 'GET', path: '/api/v1/orders', name: 'List Orders' },
    { id: 'get-order-by-id', method: 'GET', path: '/api/v1/orders/:id', name: 'Get Order by ID' },
    { id: 'create-order', method: 'POST', path: '/api/v1/orders', name: 'Create Order (Checkout)' },
    { id: 'update-order-status', method: 'PATCH', path: '/api/v1/orders/:id/status', name: 'Update Order Status' },
    { id: 'cancel-order', method: 'POST', path: '/api/v1/orders/:id/cancel', name: 'Cancel Order' },
  ];

  console.log(`Found ${ordersModule.endpoints.length} Orders Endpoints defined.`);

  // 1. Verify schema consistency
  for (const exp of expectedEndpoints) {
    const ep = ordersModule.endpoints.find((e) => e.id === exp.id);
    if (!ep) {
      throw new Error(`Missing expected endpoint: ${exp.id}`);
    }
    if (ep.method !== exp.method || ep.path !== exp.path) {
      throw new Error(`Endpoint mismatch for ${exp.id}: expected ${exp.method} ${exp.path}, got ${exp.method} ${exp.path}`);
    }
    console.log(`  ✓ Definition Verified: [${ep.method}] ${ep.path} - "${ep.name}"`);
  }

  console.log('\n🚀 Executing Live Pipeline Tests on Orders Endpoints:');

  // Test 1: List Orders
  const resList = await executeApiRequest({
    path: '/api/v1/orders',
    method: 'GET',
    queryParams: { status: 'processing', limit: 10 },
    bearerToken: sampleToken
  });
  console.log(`  1. List Orders (GET /api/v1/orders): HTTP ${resList.status} ${resList.statusText} (${resList.durationMs}ms)`);
  if (resList.status !== 200 || resList.isError) {
    throw new Error('List Orders execution failed');
  }

  // Test 2: Get Order Detail
  const resDetail = await executeApiRequest({
    path: '/api/v1/orders/:id',
    method: 'GET',
    pathParams: { id: 'ord_9281a' },
    bearerToken: sampleToken
  });
  console.log(`  2. Order Detail (GET /api/v1/orders/:id): HTTP ${resDetail.status} ${resDetail.statusText} (${resDetail.durationMs}ms)`);
  if (resDetail.status !== 200 || resDetail.isError) {
    throw new Error('Order detail execution failed');
  }

  // Test 3: Create Order / Checkout
  const resCreate = await executeApiRequest({
    path: '/api/v1/orders',
    method: 'POST',
    bearerToken: sampleToken,
    body: {
      shipping_address_id: 'addr_9910',
      payment_method: 'card',
      items: [{ product_id: 'prod_901a8f', quantity: 2 }],
      customer_notes: 'Priority delivery'
    }
  });
  console.log(`  3. Create Order (POST /api/v1/orders): HTTP ${resCreate.status} ${resCreate.statusText} (${resCreate.durationMs}ms)`);
  if (resCreate.status !== 201 || resCreate.isError) {
    throw new Error('Create order execution failed');
  }

  // Test 4: Update Order Status (Admin Auth)
  const resUpdateStatus = await executeApiRequest({
    path: '/api/v1/orders/:id/status',
    method: 'PATCH',
    pathParams: { id: 'ord_9281a' },
    bearerToken: sampleAdminToken,
    body: {
      status: 'shipped',
      tracking_code: 'TRK-FEDEX-8812930',
      notify_customer: true
    }
  });
  console.log(`  4. Update Status (PATCH /api/v1/orders/:id/status): HTTP ${resUpdateStatus.status} ${resUpdateStatus.statusText} (${resUpdateStatus.durationMs}ms)`);
  if (resUpdateStatus.status !== 200 || resUpdateStatus.isError) {
    throw new Error('Update order status execution failed');
  }

  // Test 5: Cancel Order
  const resCancel = await executeApiRequest({
    path: '/api/v1/orders/:id/cancel',
    method: 'POST',
    pathParams: { id: 'ord_9281a' },
    bearerToken: sampleToken,
    body: {
      reason: 'Customer requested change of address'
    }
  });
  console.log(`  5. Cancel Order (POST /api/v1/orders/:id/cancel): HTTP ${resCancel.status} ${resCancel.statusText} (${resCancel.durationMs}ms)`);
  if (resCancel.status !== 200 || resCancel.isError) {
    throw new Error('Cancel order execution failed');
  }

  // Test 6: Verify Auth Guard on List Orders without token
  const resUnauth = await executeApiRequest({
    path: '/api/v1/orders',
    method: 'GET',
    endpointId: 'get-orders'
  });
  console.log(`  6. Auth Guard Test (GET /api/v1/orders without token): HTTP ${resUnauth.status} ${resUnauth.statusText} (Expected 401)`);
  if (resUnauth.status !== 401) {
    throw new Error(`Auth guard failed: expected 401, got ${resUnauth.status}`);
  }

  // Test 7: Verify Code Snippet Generation for all 5 endpoints
  console.log('\n💻 Verifying Code Snippet Generation for Orders:');
  for (const ep of ordersModule.endpoints) {
    const curl = generateCurlSnippet(ep, { bearerToken: sampleToken });
    const fetchCode = generateFetchSnippet(ep, { bearerToken: sampleToken });
    const axiosCode = generateAxiosSnippet(ep, { bearerToken: sampleToken });
    if (!curl || !fetchCode || !axiosCode) {
      throw new Error(`Code generation failed for order endpoint ${ep.id}`);
    }
    console.log(`  ✓ Generated cURL, Fetch, Axios for ${ep.method} ${ep.path}`);
  }

  console.log('\n🎉 Orders API Module (All 5 Endpoints) Fully Tested and Verified!');
}

runStep17OrdersModuleTests();

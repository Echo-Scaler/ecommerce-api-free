import { API_MODULES } from '../src/data/api-modules';
import { executeApiRequest } from '../src/lib/api-client';
import { generateCurlSnippet, generateFetchSnippet, generateAxiosSnippet } from '../src/lib/code-generator';

async function runStep20CartModuleTests() {
  console.log('🛍 Starting Comprehensive Verification for Shopping Cart API Module...\n');

  const cartModule = API_MODULES.find((m) => m.id === 'cart');
  if (!cartModule) {
    throw new Error('Cart module not found in API_MODULES');
  }

  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.customer-token';

  const expectedEndpoints = [
    { id: 'get-cart', method: 'GET', path: '/api/v1/cart', name: 'Get Active Cart' },
    { id: 'add-cart-item', method: 'POST', path: '/api/v1/cart/items', name: 'Add Item to Cart' },
    { id: 'update-cart-item', method: 'PUT', path: '/api/v1/cart/items/:itemId', name: 'Update Item Quantity' },
    { id: 'delete-cart-item', method: 'DELETE', path: '/api/v1/cart/items/:itemId', name: 'Remove Cart Item' },
    { id: 'clear-cart', method: 'DELETE', path: '/api/v1/cart', name: 'Clear Cart' },
  ];

  console.log(`Found ${cartModule.endpoints.length} Cart Endpoints defined.`);

  // 1. Verify schema consistency
  for (const exp of expectedEndpoints) {
    const ep = cartModule.endpoints.find((e) => e.id === exp.id);
    if (!ep) {
      throw new Error(`Missing expected endpoint: ${exp.id}`);
    }
    if (ep.method !== exp.method || ep.path !== exp.path) {
      throw new Error(`Endpoint mismatch for ${exp.id}: expected ${exp.method} ${exp.path}, got ${exp.method} ${exp.path}`);
    }
    console.log(`  ✓ Definition Verified: [${ep.method}] ${ep.path} - "${ep.name}"`);
  }

  console.log('\n🚀 Executing Live Pipeline Tests on Cart Endpoints:');

  // Test 1: Get Active Cart
  const resGetCart = await executeApiRequest({
    path: '/api/v1/cart',
    method: 'GET',
    bearerToken: sampleToken
  });
  console.log(`  1. Get Cart (GET /api/v1/cart): HTTP ${resGetCart.status} ${resGetCart.statusText} (${resGetCart.durationMs}ms)`);
  if (resGetCart.status !== 200 || resGetCart.isError) {
    throw new Error('Get Cart execution failed');
  }

  // Test 2: Add Item to Cart
  const resAddItem = await executeApiRequest({
    path: '/api/v1/cart/items',
    method: 'POST',
    bearerToken: sampleToken,
    body: {
      product_id: 'prod_902b7e',
      quantity: 2
    }
  });
  console.log(`  2. Add Item (POST /api/v1/cart/items): HTTP ${resAddItem.status} ${resAddItem.statusText} (${resAddItem.durationMs}ms)`);
  if (resAddItem.status !== 200 || resAddItem.isError) {
    throw new Error('Add item to cart execution failed');
  }

  // Test 3: Update Item Quantity
  const resUpdateQty = await executeApiRequest({
    path: '/api/v1/cart/items/:itemId',
    method: 'PUT',
    pathParams: { itemId: 'item_101' },
    bearerToken: sampleToken,
    body: {
      quantity: 4
    }
  });
  console.log(`  3. Update Quantity (PUT /api/v1/cart/items/:itemId): HTTP ${resUpdateQty.status} ${resUpdateQty.statusText} (${resUpdateQty.durationMs}ms)`);
  if (resUpdateQty.status !== 200 || resUpdateQty.isError) {
    throw new Error('Update quantity execution failed');
  }

  // Test 4: Delete Single Cart Item
  const resDeleteItem = await executeApiRequest({
    path: '/api/v1/cart/items/:itemId',
    method: 'DELETE',
    pathParams: { itemId: 'item_101' },
    bearerToken: sampleToken
  });
  console.log(`  4. Delete Item (DELETE /api/v1/cart/items/:itemId): HTTP ${resDeleteItem.status} ${resDeleteItem.statusText} (${resDeleteItem.durationMs}ms)`);
  if (resDeleteItem.status !== 200 || resDeleteItem.isError) {
    throw new Error('Delete cart item execution failed');
  }

  // Test 5: Clear Entire Cart
  const resClearCart = await executeApiRequest({
    path: '/api/v1/cart',
    method: 'DELETE',
    bearerToken: sampleToken
  });
  console.log(`  5. Clear Cart (DELETE /api/v1/cart): HTTP ${resClearCart.status} ${resClearCart.statusText} (${resClearCart.durationMs}ms)`);
  if (resClearCart.status !== 200 || resClearCart.isError) {
    throw new Error('Clear cart execution failed');
  }

  // Test 6: Verify Auth Guard on Cart without token
  const resUnauth = await executeApiRequest({
    path: '/api/v1/cart',
    method: 'GET',
    endpointId: 'get-cart'
  });
  console.log(`  6. Auth Guard Test (GET /api/v1/cart without token): HTTP ${resUnauth.status} ${resUnauth.statusText} (Expected 401)`);
  if (resUnauth.status !== 401) {
    throw new Error(`Auth guard failed: expected 401, got ${resUnauth.status}`);
  }

  // Test 7: Verify Code Snippet Generation for all 5 endpoints
  console.log('\n💻 Verifying Code Snippet Generation for Cart:');
  for (const ep of cartModule.endpoints) {
    const curl = generateCurlSnippet(ep, { bearerToken: sampleToken });
    const fetchCode = generateFetchSnippet(ep, { bearerToken: sampleToken });
    const axiosCode = generateAxiosSnippet(ep, { bearerToken: sampleToken });
    if (!curl || !fetchCode || !axiosCode) {
      throw new Error(`Code generation failed for cart endpoint ${ep.id}`);
    }
    console.log(`  ✓ Generated cURL, Fetch, Axios for ${ep.method} ${ep.path}`);
  }

  console.log('\n🎉 Shopping Cart API Module (All 5 Endpoints) Fully Tested and Verified!');
}

runStep20CartModuleTests();

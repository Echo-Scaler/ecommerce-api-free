import { API_MODULES } from '../src/data/api-modules';
import { executeApiRequest } from '../src/lib/api-client';
import { generateCurlSnippet, generateFetchSnippet, generateAxiosSnippet } from '../src/lib/code-generator';

async function runStep15ProductsModuleTests() {
  console.log('📦 Starting Comprehensive Verification for Products API Module...\n');

  const productsModule = API_MODULES.find((m) => m.id === 'products');
  if (!productsModule) {
    throw new Error('Products module not found in API_MODULES');
  }

  const sampleAdminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin-token';
  const expectedEndpoints = [
    { id: 'get-products', method: 'GET', path: '/api/v1/products', name: 'List Products' },
    { id: 'get-product-by-id', method: 'GET', path: '/api/v1/products/:id', name: 'Get Product by ID' },
    { id: 'create-product', method: 'POST', path: '/api/v1/products', name: 'Create Product' },
    { id: 'update-product', method: 'PUT', path: '/api/v1/products/:id', name: 'Update Product' },
    { id: 'delete-product', method: 'DELETE', path: '/api/v1/products/:id', name: 'Delete Product' },
  ];

  console.log(`Found ${productsModule.endpoints.length} Products Endpoints defined.`);

  // 1. Verify schema consistency
  for (const exp of expectedEndpoints) {
    const ep = productsModule.endpoints.find((e) => e.id === exp.id);
    if (!ep) {
      throw new Error(`Missing expected endpoint: ${exp.id}`);
    }
    if (ep.method !== exp.method || ep.path !== exp.path) {
      throw new Error(`Endpoint mismatch for ${exp.id}: expected ${exp.method} ${exp.path}, got ${ep.method} ${ep.path}`);
    }
    console.log(`  ✓ Definition Verified: [${ep.method}] ${ep.path} - "${ep.name}"`);
  }

  console.log('\n🚀 Executing Live Pipeline Tests on Products Endpoints:');

  // Test 1: List Products
  const resList = await executeApiRequest({
    path: '/api/v1/products',
    method: 'GET',
    queryParams: { page: 1, limit: 10, sort: 'price:asc' }
  });
  console.log(`  1. List Products (GET /api/v1/products): HTTP ${resList.status} ${resList.statusText} (${resList.durationMs}ms)`);
  if (resList.status !== 200 || resList.isError) {
    throw new Error('List Products execution failed');
  }

  // Test 2: Get Product Detail
  const resDetail = await executeApiRequest({
    path: '/api/v1/products/:id',
    method: 'GET',
    pathParams: { id: 'prod_901a8f' }
  });
  console.log(`  2. Product Detail (GET /api/v1/products/:id): HTTP ${resDetail.status} ${resDetail.statusText} (${resDetail.durationMs}ms)`);
  if (resDetail.status !== 200 || resDetail.isError) {
    throw new Error('Product detail execution failed');
  }

  // Test 3: Create Product (Admin Auth)
  const resCreate = await executeApiRequest({
    path: '/api/v1/products',
    method: 'POST',
    bearerToken: sampleAdminToken,
    body: {
      name: 'Sony WH-1000XM6 Preview',
      sku: 'SNY-WH1000XM6-BLK',
      price: 449.99,
      category_id: 'cat_electronics',
      stock: 30
    }
  });
  console.log(`  3. Create Product (POST /api/v1/products): HTTP ${resCreate.status} ${resCreate.statusText} (${resCreate.durationMs}ms)`);
  if (resCreate.status !== 201 || resCreate.isError) {
    throw new Error('Create product execution failed');
  }

  // Test 4: Update Product (Admin Auth)
  const resUpdate = await executeApiRequest({
    path: '/api/v1/products/:id',
    method: 'PUT',
    pathParams: { id: 'prod_901a8f' },
    bearerToken: sampleAdminToken,
    body: {
      price: 349.99,
      stock: 55
    }
  });
  console.log(`  4. Update Product (PUT /api/v1/products/:id): HTTP ${resUpdate.status} ${resUpdate.statusText} (${resUpdate.durationMs}ms)`);
  if (resUpdate.status !== 200 || resUpdate.isError) {
    throw new Error('Update product execution failed');
  }

  // Test 5: Delete Product (Admin Auth)
  const resDelete = await executeApiRequest({
    path: '/api/v1/products/:id',
    method: 'DELETE',
    pathParams: { id: 'prod_901a8f' },
    bearerToken: sampleAdminToken
  });
  console.log(`  5. Delete Product (DELETE /api/v1/products/:id): HTTP ${resDelete.status} ${resDelete.statusText} (${resDelete.durationMs}ms)`);
  if (resDelete.status !== 200 || resDelete.isError) {
    throw new Error('Delete product execution failed');
  }

  // Test 6: Verify Auth Guard on Create Product without token
  const resUnauth = await executeApiRequest({
    path: '/api/v1/products',
    method: 'POST',
    endpointId: 'create-product',
    body: { name: 'Test' }
  });
  console.log(`  6. Auth Guard Test (POST /api/v1/products without token): HTTP ${resUnauth.status} ${resUnauth.statusText} (Expected 401)`);
  if (resUnauth.status !== 401) {
    throw new Error(`Auth guard failed: expected 401, got ${resUnauth.status}`);
  }

  // Test 7: Verify Code Snippet Generation for all 5 endpoints
  console.log('\n💻 Verifying Code Snippet Generation for Products:');
  for (const ep of productsModule.endpoints) {
    const curl = generateCurlSnippet(ep, { bearerToken: sampleAdminToken });
    const fetchCode = generateFetchSnippet(ep, { bearerToken: sampleAdminToken });
    const axiosCode = generateAxiosSnippet(ep, { bearerToken: sampleAdminToken });
    if (!curl || !fetchCode || !axiosCode) {
      throw new Error(`Code generation failed for product endpoint ${ep.id}`);
    }
    console.log(`  ✓ Generated cURL, Fetch, Axios for ${ep.method} ${ep.path}`);
  }

  console.log('\n🎉 Products API Module (All 5 Endpoints) Fully Tested and Verified!');
}

runStep15ProductsModuleTests();

import { API_MODULES } from '../src/data/api-modules';
import { executeApiRequest } from '../src/lib/api-client';
import { generateCurlSnippet, generateFetchSnippet, generateAxiosSnippet } from '../src/lib/code-generator';

async function runStep16CategoriesModuleTests() {
  console.log('🗂 Starting Comprehensive Verification for Categories API Module...\n');

  const categoriesModule = API_MODULES.find((m) => m.id === 'categories');
  if (!categoriesModule) {
    throw new Error('Categories module not found in API_MODULES');
  }

  const sampleAdminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin-token';
  const expectedEndpoints = [
    { id: 'get-categories', method: 'GET', path: '/api/v1/categories', name: 'List Categories' },
    { id: 'get-category-by-id', method: 'GET', path: '/api/v1/categories/:id', name: 'Get Category by ID' },
    { id: 'create-category', method: 'POST', path: '/api/v1/categories', name: 'Create Category' },
    { id: 'update-category', method: 'PUT', path: '/api/v1/categories/:id', name: 'Update Category' },
    { id: 'delete-category', method: 'DELETE', path: '/api/v1/categories/:id', name: 'Delete Category' },
  ];

  console.log(`Found ${categoriesModule.endpoints.length} Categories Endpoints defined.`);

  // 1. Verify schema consistency
  for (const exp of expectedEndpoints) {
    const ep = categoriesModule.endpoints.find((e) => e.id === exp.id);
    if (!ep) {
      throw new Error(`Missing expected endpoint: ${exp.id}`);
    }
    if (ep.method !== exp.method || ep.path !== exp.path) {
      throw new Error(`Endpoint mismatch for ${exp.id}: expected ${exp.method} ${exp.path}, got ${exp.method} ${exp.path}`);
    }
    console.log(`  ✓ Definition Verified: [${ep.method}] ${ep.path} - "${ep.name}"`);
  }

  console.log('\n🚀 Executing Live Pipeline Tests on Categories Endpoints:');

  // Test 1: List Categories
  const resList = await executeApiRequest({
    path: '/api/v1/categories',
    method: 'GET'
  });
  console.log(`  1. List Categories (GET /api/v1/categories): HTTP ${resList.status} ${resList.statusText} (${resList.durationMs}ms)`);
  if (resList.status !== 200 || resList.isError) {
    throw new Error('List Categories execution failed');
  }

  // Test 2: Get Category Detail
  const resDetail = await executeApiRequest({
    path: '/api/v1/categories/:id',
    method: 'GET',
    pathParams: { id: 'cat_electronics' }
  });
  console.log(`  2. Category Detail (GET /api/v1/categories/:id): HTTP ${resDetail.status} ${resDetail.statusText} (${resDetail.durationMs}ms)`);
  if (resDetail.status !== 200 || resDetail.isError) {
    throw new Error('Category detail execution failed');
  }

  // Test 3: Create Category (Admin Auth)
  const resCreate = await executeApiRequest({
    path: '/api/v1/categories',
    method: 'POST',
    bearerToken: sampleAdminToken,
    body: {
      name: 'Smart Home Devices',
      slug: 'smart-home',
      description: 'Connected IoT devices, security cameras, and home automation.',
      parent_id: 'cat_electronics'
    }
  });
  console.log(`  3. Create Category (POST /api/v1/categories): HTTP ${resCreate.status} ${resCreate.statusText} (${resCreate.durationMs}ms)`);
  if (resCreate.status !== 201 || resCreate.isError) {
    throw new Error('Create category execution failed');
  }

  // Test 4: Update Category (Admin Auth)
  const resUpdate = await executeApiRequest({
    path: '/api/v1/categories/:id',
    method: 'PUT',
    pathParams: { id: 'cat_electronics' },
    bearerToken: sampleAdminToken,
    body: {
      name: 'Consumer Electronics & Gadgets',
      description: 'Updated comprehensive electronics collection.'
    }
  });
  console.log(`  4. Update Category (PUT /api/v1/categories/:id): HTTP ${resUpdate.status} ${resUpdate.statusText} (${resUpdate.durationMs}ms)`);
  if (resUpdate.status !== 200 || resUpdate.isError) {
    throw new Error('Update category execution failed');
  }

  // Test 5: Delete Category (Admin Auth)
  const resDelete = await executeApiRequest({
    path: '/api/v1/categories/:id',
    method: 'DELETE',
    pathParams: { id: 'cat_smarthome_99' },
    bearerToken: sampleAdminToken
  });
  console.log(`  5. Delete Category (DELETE /api/v1/categories/:id): HTTP ${resDelete.status} ${resDelete.statusText} (${resDelete.durationMs}ms)`);
  if (resDelete.status !== 200 || resDelete.isError) {
    throw new Error('Delete category execution failed');
  }

  // Test 6: Verify Auth Guard on Create Category without token
  const resUnauth = await executeApiRequest({
    path: '/api/v1/categories',
    method: 'POST',
    endpointId: 'create-category',
    body: { name: 'Unauthorized Category' }
  });
  console.log(`  6. Auth Guard Test (POST /api/v1/categories without token): HTTP ${resUnauth.status} ${resUnauth.statusText} (Expected 401)`);
  if (resUnauth.status !== 401) {
    throw new Error(`Auth guard failed: expected 401, got ${resUnauth.status}`);
  }

  // Test 7: Verify Code Snippet Generation for all 5 category endpoints
  console.log('\n💻 Verifying Code Snippet Generation for Categories:');
  for (const ep of categoriesModule.endpoints) {
    const curl = generateCurlSnippet(ep, { bearerToken: sampleAdminToken });
    const fetchCode = generateFetchSnippet(ep, { bearerToken: sampleAdminToken });
    const axiosCode = generateAxiosSnippet(ep, { bearerToken: sampleAdminToken });
    if (!curl || !fetchCode || !axiosCode) {
      throw new Error(`Code generation failed for category endpoint ${ep.id}`);
    }
    console.log(`  ✓ Generated cURL, Fetch, Axios for ${ep.method} ${ep.path}`);
  }

  console.log('\n🎉 Categories API Module (All 5 Endpoints) Fully Tested and Verified!');
}

runStep16CategoriesModuleTests();

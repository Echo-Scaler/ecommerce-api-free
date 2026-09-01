import { API_MODULES } from '../src/data/api-modules';
import { executeApiRequest } from '../src/lib/api-client';
import { generateCurlSnippet, generateFetchSnippet, generateAxiosSnippet } from '../src/lib/code-generator';

async function runStep18CustomersModuleTests() {
  console.log('👤 Starting Comprehensive Verification for Customers API Module...\n');

  const customersModule = API_MODULES.find((m) => m.id === 'customers');
  if (!customersModule) {
    throw new Error('Customers module not found in API_MODULES');
  }

  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.customer-token';

  const expectedEndpoints = [
    { id: 'get-customer-profile', method: 'GET', path: '/api/v1/customers/profile', name: 'Get Customer Profile' },
    { id: 'update-customer-profile', method: 'PUT', path: '/api/v1/customers/profile', name: 'Update Customer Profile' },
    { id: 'get-customer-addresses', method: 'GET', path: '/api/v1/customers/addresses', name: 'List Saved Addresses' },
    { id: 'create-customer-address', method: 'POST', path: '/api/v1/customers/addresses', name: 'Add Address' },
    { id: 'delete-customer-address', method: 'DELETE', path: '/api/v1/customers/addresses/:id', name: 'Delete Address' },
  ];

  console.log(`Found ${customersModule.endpoints.length} Customers Endpoints defined.`);

  // 1. Verify schema consistency
  for (const exp of expectedEndpoints) {
    const ep = customersModule.endpoints.find((e) => e.id === exp.id);
    if (!ep) {
      throw new Error(`Missing expected endpoint: ${exp.id}`);
    }
    if (ep.method !== exp.method || ep.path !== exp.path) {
      throw new Error(`Endpoint mismatch for ${exp.id}: expected ${exp.method} ${exp.path}, got ${exp.method} ${exp.path}`);
    }
    console.log(`  ✓ Definition Verified: [${ep.method}] ${ep.path} - "${ep.name}"`);
  }

  console.log('\n🚀 Executing Live Pipeline Tests on Customers Endpoints:');

  // Test 1: Get Customer Profile
  const resProfile = await executeApiRequest({
    path: '/api/v1/customers/profile',
    method: 'GET',
    bearerToken: sampleToken
  });
  console.log(`  1. Get Profile (GET /api/v1/customers/profile): HTTP ${resProfile.status} ${resProfile.statusText} (${resProfile.durationMs}ms)`);
  if (resProfile.status !== 200 || resProfile.isError) {
    throw new Error('Get Profile execution failed');
  }

  // Test 2: Update Customer Profile
  const resUpdateProfile = await executeApiRequest({
    path: '/api/v1/customers/profile',
    method: 'PUT',
    bearerToken: sampleToken,
    body: {
      first_name: 'Alexander',
      last_name: 'Mercer',
      phone: '+1-555-4321'
    }
  });
  console.log(`  2. Update Profile (PUT /api/v1/customers/profile): HTTP ${resUpdateProfile.status} ${resUpdateProfile.statusText} (${resUpdateProfile.durationMs}ms)`);
  if (resUpdateProfile.status !== 200 || resUpdateProfile.isError) {
    throw new Error('Update Profile execution failed');
  }

  // Test 3: List Saved Addresses
  const resAddresses = await executeApiRequest({
    path: '/api/v1/customers/addresses',
    method: 'GET',
    bearerToken: sampleToken
  });
  console.log(`  3. List Addresses (GET /api/v1/customers/addresses): HTTP ${resAddresses.status} ${resAddresses.statusText} (${resAddresses.durationMs}ms)`);
  if (resAddresses.status !== 200 || resAddresses.isError) {
    throw new Error('List Addresses execution failed');
  }

  // Test 4: Add New Address
  const resAddAddress = await executeApiRequest({
    path: '/api/v1/customers/addresses',
    method: 'POST',
    bearerToken: sampleToken,
    body: {
      label: 'Studio',
      recipient_name: 'Alex Mercer',
      street_line_1: '200 Design Blvd',
      city: 'Portland',
      state: 'OR',
      postal_code: '97201',
      country: 'US',
      is_default: false
    }
  });
  console.log(`  4. Add Address (POST /api/v1/customers/addresses): HTTP ${resAddAddress.status} ${resAddAddress.statusText} (${resAddAddress.durationMs}ms)`);
  if (resAddAddress.status !== 201 || resAddAddress.isError) {
    throw new Error('Add Address execution failed');
  }

  // Test 5: Delete Address
  const resDeleteAddress = await executeApiRequest({
    path: '/api/v1/customers/addresses/:id',
    method: 'DELETE',
    pathParams: { id: 'addr_9911' },
    bearerToken: sampleToken
  });
  console.log(`  5. Delete Address (DELETE /api/v1/customers/addresses/:id): HTTP ${resDeleteAddress.status} ${resDeleteAddress.statusText} (${resDeleteAddress.durationMs}ms)`);
  if (resDeleteAddress.status !== 200 || resDeleteAddress.isError) {
    throw new Error('Delete Address execution failed');
  }

  // Test 6: Verify Auth Guard on Profile without token
  const resUnauth = await executeApiRequest({
    path: '/api/v1/customers/profile',
    method: 'GET',
    endpointId: 'get-customer-profile'
  });
  console.log(`  6. Auth Guard Test (GET /api/v1/customers/profile without token): HTTP ${resUnauth.status} ${resUnauth.statusText} (Expected 401)`);
  if (resUnauth.status !== 401) {
    throw new Error(`Auth guard failed: expected 401, got ${resUnauth.status}`);
  }

  // Test 7: Verify Code Snippet Generation for all 5 endpoints
  console.log('\n💻 Verifying Code Snippet Generation for Customers:');
  for (const ep of customersModule.endpoints) {
    const curl = generateCurlSnippet(ep, { bearerToken: sampleToken });
    const fetchCode = generateFetchSnippet(ep, { bearerToken: sampleToken });
    const axiosCode = generateAxiosSnippet(ep, { bearerToken: sampleToken });
    if (!curl || !fetchCode || !axiosCode) {
      throw new Error(`Code generation failed for customer endpoint ${ep.id}`);
    }
    console.log(`  ✓ Generated cURL, Fetch, Axios for ${ep.method} ${ep.path}`);
  }

  console.log('\n🎉 Customers API Module (All 5 Endpoints) Fully Tested and Verified!');
}

runStep18CustomersModuleTests();

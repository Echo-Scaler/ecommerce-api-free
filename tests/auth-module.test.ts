import { API_MODULES } from '../src/data/api-modules';
import { executeApiRequest } from '../src/lib/api-client';
import { generateCurlSnippet, generateFetchSnippet, generateAxiosSnippet } from '../src/lib/code-generator';

async function runStep19AuthModuleTests() {
  console.log('🔐 Starting Comprehensive Verification for Authentication API Module...\n');

  const authModule = API_MODULES.find((m) => m.id === 'auth');
  if (!authModule) {
    throw new Error('Authentication module not found in API_MODULES');
  }

  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-test-token';

  const expectedEndpoints = [
    { id: 'auth-register', method: 'POST', path: '/api/v1/auth/register', name: 'Register Customer' },
    { id: 'auth-login', method: 'POST', path: '/api/v1/auth/login', name: 'Customer Login' },
    { id: 'auth-refresh', method: 'POST', path: '/api/v1/auth/refresh', name: 'Refresh Token' },
    { id: 'auth-logout', method: 'POST', path: '/api/v1/auth/logout', name: 'Logout Session' },
    { id: 'auth-me', method: 'GET', path: '/api/v1/auth/me', name: 'Get Current Session Info' },
  ];

  console.log(`Found ${authModule.endpoints.length} Auth Endpoints defined.`);

  // 1. Verify schema consistency
  for (const exp of expectedEndpoints) {
    const ep = authModule.endpoints.find((e) => e.id === exp.id);
    if (!ep) {
      throw new Error(`Missing expected endpoint: ${exp.id}`);
    }
    if (ep.method !== exp.method || ep.path !== exp.path) {
      throw new Error(`Endpoint mismatch for ${exp.id}: expected ${exp.method} ${exp.path}, got ${exp.method} ${exp.path}`);
    }
    console.log(`  ✓ Definition Verified: [${ep.method}] ${ep.path} - "${ep.name}"`);
  }

  console.log('\n🚀 Executing Live Pipeline Tests on Auth Endpoints:');

  // Test 1: Register Customer
  const resRegister = await executeApiRequest({
    path: '/api/v1/auth/register',
    method: 'POST',
    body: {
      email: 'alex.mercer@example.com',
      password: 'SuperSecurePassword!2026',
      first_name: 'Alex',
      last_name: 'Mercer'
    }
  });
  console.log(`  1. Register (POST /api/v1/auth/register): HTTP ${resRegister.status} ${resRegister.statusText} (${resRegister.durationMs}ms)`);
  if (resRegister.status !== 201 || resRegister.isError) {
    throw new Error('Register customer execution failed');
  }

  // Test 2: Customer Login
  const resLogin = await executeApiRequest({
    path: '/api/v1/auth/login',
    method: 'POST',
    body: {
      email: 'alex.mercer@example.com',
      password: 'SuperSecurePassword!2026'
    }
  });
  console.log(`  2. Login (POST /api/v1/auth/login): HTTP ${resLogin.status} ${resLogin.statusText} (${resLogin.durationMs}ms)`);
  if (resLogin.status !== 200 || resLogin.isError) {
    throw new Error('Customer login execution failed');
  }

  // Test 3: Refresh Token
  const resRefresh = await executeApiRequest({
    path: '/api/v1/auth/refresh',
    method: 'POST',
    bearerToken: sampleToken
  });
  console.log(`  3. Refresh Token (POST /api/v1/auth/refresh): HTTP ${resRefresh.status} ${resRefresh.statusText} (${resRefresh.durationMs}ms)`);
  if (resRefresh.status !== 200 || resRefresh.isError) {
    throw new Error('Refresh token execution failed');
  }

  // Test 4: Logout Session
  const resLogout = await executeApiRequest({
    path: '/api/v1/auth/logout',
    method: 'POST',
    bearerToken: sampleToken
  });
  console.log(`  4. Logout (POST /api/v1/auth/logout): HTTP ${resLogout.status} ${resLogout.statusText} (${resLogout.durationMs}ms)`);
  if (resLogout.status !== 200 || resLogout.isError) {
    throw new Error('Logout execution failed');
  }

  // Test 5: Get Current Session Info (GET /api/v1/auth/me)
  const resMe = await executeApiRequest({
    path: '/api/v1/auth/me',
    method: 'GET',
    bearerToken: sampleToken
  });
  console.log(`  5. Session Info (GET /api/v1/auth/me): HTTP ${resMe.status} ${resMe.statusText} (${resMe.durationMs}ms)`);
  if (resMe.status !== 200 || resMe.isError) {
    throw new Error('Session info execution failed');
  }

  // Test 6: Verify Auth Guard on Logout without token
  const resUnauth = await executeApiRequest({
    path: '/api/v1/auth/logout',
    method: 'POST',
    endpointId: 'auth-logout'
  });
  console.log(`  6. Auth Guard Test (POST /api/v1/auth/logout without token): HTTP ${resUnauth.status} ${resUnauth.statusText} (Expected 401)`);
  if (resUnauth.status !== 401) {
    throw new Error(`Auth guard failed: expected 401, got ${resUnauth.status}`);
  }

  // Test 7: Verify Code Snippet Generation for all 5 endpoints
  console.log('\n💻 Verifying Code Snippet Generation for Auth:');
  for (const ep of authModule.endpoints) {
    const curl = generateCurlSnippet(ep, { bearerToken: sampleToken });
    const fetchCode = generateFetchSnippet(ep, { bearerToken: sampleToken });
    const axiosCode = generateAxiosSnippet(ep, { bearerToken: sampleToken });
    if (!curl || !fetchCode || !axiosCode) {
      throw new Error(`Code generation failed for auth endpoint ${ep.id}`);
    }
    console.log(`  ✓ Generated cURL, Fetch, Axios for ${ep.method} ${ep.path}`);
  }

  console.log('\n🎉 Authentication API Module (All 5 Endpoints) Fully Tested and Verified!');
}

runStep19AuthModuleTests();

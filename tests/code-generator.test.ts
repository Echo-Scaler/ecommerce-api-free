import { API_MODULES } from '../src/data/api-modules';
import { generateCurlSnippet, generateFetchSnippet, generateAxiosSnippet } from '../src/lib/code-generator';

function runStep14CodeGeneratorTests() {
  console.log('🚀 Testing Dynamic Code Snippet Generators (cURL, Fetch, Axios)...\n');

  // Test across different endpoint types
  const sampleEndpoints = [
    API_MODULES[0].endpoints[0], // GET /api/v1/products (query params)
    API_MODULES[0].endpoints[1], // GET /api/v1/products/:id (path params)
    API_MODULES[2].endpoints[1], // POST /api/v1/orders (auth required + body)
    API_MODULES[4].endpoints[0], // POST /api/v1/auth/login (body)
  ];

  for (const ep of sampleEndpoints) {
    console.log(`📌 Testing ${ep.method} ${ep.path} (${ep.name}):`);

    // 1. cURL
    const curl = generateCurlSnippet(ep, { bearerToken: 'sample_token_123' });
    if (!curl.includes('curl -X') || !curl.includes(ep.method)) {
      throw new Error(`cURL generation failed for ${ep.name}`);
    }
    console.log(`   ✓ cURL: valid command structure`);

    // 2. Fetch
    const fetchCode = generateFetchSnippet(ep, { bearerToken: 'sample_token_123' });
    if (!fetchCode.includes('fetch(') || !fetchCode.includes(ep.method)) {
      throw new Error(`Fetch generation failed for ${ep.name}`);
    }
    console.log(`   ✓ Fetch: valid async/await snippet`);

    // 3. Axios
    const axiosCode = generateAxiosSnippet(ep, { bearerToken: 'sample_token_123' });
    if (!axiosCode.includes('axios(') || !axiosCode.includes(ep.method.toLowerCase())) {
      throw new Error(`Axios generation failed for ${ep.name}`);
    }
    console.log(`   ✓ Axios: valid axios request configuration`);
  }

  console.log('\n🎉 All Code Generators (cURL, Fetch, Axios) Verified Successfully!');
}

runStep14CodeGeneratorTests();

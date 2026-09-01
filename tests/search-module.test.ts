import { API_MODULES } from '../src/data/api-modules';
import { executeApiRequest } from '../src/lib/api-client';
import { generateCurlSnippet, generateFetchSnippet, generateAxiosSnippet } from '../src/lib/code-generator';

async function runStep21SearchModuleTests() {
  console.log('🔎 Starting Comprehensive Verification for Product Search API Module...\n');

  const searchModule = API_MODULES.find((m) => m.id === 'search');
  if (!searchModule) {
    throw new Error('Search module not found in API_MODULES');
  }

  const expectedEndpoints = [
    { id: 'search-products', method: 'GET', path: '/api/v1/search', name: 'Search Products' },
    { id: 'search-suggestions', method: 'GET', path: '/api/v1/search/suggestions', name: 'Search Suggestions' },
  ];

  console.log(`Found ${searchModule.endpoints.length} Search Endpoints defined.`);

  // 1. Verify schema consistency
  for (const exp of expectedEndpoints) {
    const ep = searchModule.endpoints.find((e) => e.id === exp.id);
    if (!ep) {
      throw new Error(`Missing expected endpoint: ${exp.id}`);
    }
    if (ep.method !== exp.method || ep.path !== exp.path) {
      throw new Error(`Endpoint mismatch for ${exp.id}: expected ${exp.method} ${exp.path}, got ${exp.method} ${exp.path}`);
    }
    console.log(`  ✓ Definition Verified: [${ep.method}] ${ep.path} - "${ep.name}"`);
  }

  console.log('\n🚀 Executing Live Pipeline Tests on Search Endpoints:');

  // Test 1: Full-Text Product Search with Filters & Sorting
  const resSearch = await executeApiRequest({
    path: '/api/v1/search',
    method: 'GET',
    queryParams: {
      q: 'wireless headphones',
      min_price: 100,
      max_price: 500,
      sort: 'price_asc'
    }
  });
  console.log(`  1. Product Search (GET /api/v1/search?q=wireless+headphones): HTTP ${resSearch.status} ${resSearch.statusText} (${resSearch.durationMs}ms)`);
  if (resSearch.status !== 200 || resSearch.isError) {
    throw new Error('Search products execution failed');
  }

  // Test 2: Auto-complete Search Suggestions
  const resSuggestions = await executeApiRequest({
    path: '/api/v1/search/suggestions',
    method: 'GET',
    queryParams: {
      q: 'wire'
    }
  });
  console.log(`  2. Search Suggestions (GET /api/v1/search/suggestions?q=wire): HTTP ${resSuggestions.status} ${resSuggestions.statusText} (${resSuggestions.durationMs}ms)`);
  if (resSuggestions.status !== 200 || resSuggestions.isError) {
    throw new Error('Search suggestions execution failed');
  }

  // Test 3: Verify Code Snippet Generation for both search endpoints
  console.log('\n💻 Verifying Code Snippet Generation for Search:');
  for (const ep of searchModule.endpoints) {
    const curl = generateCurlSnippet(ep);
    const fetchCode = generateFetchSnippet(ep);
    const axiosCode = generateAxiosSnippet(ep);
    if (!curl || !fetchCode || !axiosCode) {
      throw new Error(`Code generation failed for search endpoint ${ep.id}`);
    }
    console.log(`  ✓ Generated cURL, Fetch, Axios for ${ep.method} ${ep.path}`);
  }

  console.log('\n🎉 Product Search API Module (All Endpoints) Fully Tested and Verified!');
}

runStep21SearchModuleTests();

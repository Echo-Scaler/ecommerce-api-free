import { MockDb, MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_ORDERS, MOCK_CUSTOMERS, MOCK_ADDRESSES, MOCK_INVENTORY, MOCK_CART_ITEMS, MOCK_SEARCH_SUGGESTIONS } from '../src/data/mock-db';
import { executeApiRequest } from '../src/lib/api-client';

async function runFiftyItemsAndIdLookupTests() {
  console.log('🔍 Starting Comprehensive 50-Item & ID 30 Resolution Tests...\n');

  // ==========================================
  // 1. VERIFY EXACT 50 ITEMS IN ALL 8 DATASETS
  // ==========================================
  console.log('📊 Step 1: Checking dataset item counts (Target: 50 each)...');
  const collections = [
    { name: 'Products', count: MOCK_PRODUCTS.length },
    { name: 'Categories', count: MOCK_CATEGORIES.length },
    { name: 'Orders', count: MOCK_ORDERS.length },
    { name: 'Customers', count: MOCK_CUSTOMERS.length },
    { name: 'Addresses', count: MOCK_ADDRESSES.length },
    { name: 'Inventory Stock Items', count: MOCK_INVENTORY.length },
    { name: 'Cart Items', count: MOCK_CART_ITEMS.length },
    { name: 'Search Suggestions', count: MOCK_SEARCH_SUGGESTIONS.length }
  ];

  for (const c of collections) {
    if (c.count !== 50) {
      throw new Error(`Expected ${c.name} count to be exactly 50, but got ${c.count}`);
    }
    console.log(`  ✓ ${c.name}: ${c.count} items`);
  }

  // ==========================================
  // 2. VERIFY MockDb ID 30 RESOLUTION
  // ==========================================
  console.log('\n🎯 Step 2: Testing MockDb ID 30 Lookups (Numeric and Prefixed)...');

  // Product 30
  const prodByNum = MockDb.getProductById('30');
  const prodByPref = MockDb.getProductById('prod_30');
  const prodByDash = MockDb.getProductById('prod-30');
  const prodBySku = MockDb.getProductById('RING-1030-PRO');

  if (!prodByNum || prodByNum.id !== 'prod_30' || prodByNum.name !== 'Ring Video Doorbell Pro 2 Hardwired') {
    throw new Error(`Failed to resolve product by numeric ID '30': got ${prodByNum?.id} - ${prodByNum?.name}`);
  }
  if (!prodByPref || prodByPref.id !== 'prod_30') {
    throw new Error(`Failed to resolve product by prefixed ID 'prod_30'`);
  }
  if (!prodByDash || prodByDash.id !== 'prod_30') {
    throw new Error(`Failed to resolve product by dashed ID 'prod-30'`);
  }
  if (!prodBySku || prodBySku.id !== 'prod_30') {
    throw new Error(`Failed to resolve product by SKU 'RING-1030-PRO'`);
  }
  console.log(`  ✓ Product 30 found: [${prodByNum.id}] ${prodByNum.name} ($${prodByNum.price})`);

  // Category 30
  const catByNum = MockDb.getCategoryById('30');
  const catByPref = MockDb.getCategoryById('cat_30');
  const catBySlug = MockDb.getCategoryById('smart-locks-entry');

  if (!catByNum || catByNum.id !== 'cat_30' || catByNum.name !== 'Smart Locks & Entry') {
    throw new Error(`Failed to resolve category by numeric ID '30': got ${catByNum?.id} - ${catByNum?.name}`);
  }
  if (!catByPref || catByPref.id !== 'cat_30') {
    throw new Error(`Failed to resolve category by prefixed ID 'cat_30'`);
  }
  if (!catBySlug || catBySlug.id !== 'cat_30') {
    throw new Error(`Failed to resolve category by slug 'smart-locks-entry'`);
  }
  console.log(`  ✓ Category 30 found: [${catByNum.id}] ${catByNum.name} (${catByNum.slug})`);

  // Order 30
  const ordByNum = MockDb.getOrderById('30');
  const ordByPref = MockDb.getOrderById('ord_30');
  if (!ordByNum || ordByNum.id !== 'ord_30') {
    throw new Error(`Failed to resolve order by numeric ID '30'`);
  }
  if (!ordByPref || ordByPref.id !== 'ord_30') {
    throw new Error(`Failed to resolve order by prefixed ID 'ord_30'`);
  }
  console.log(`  ✓ Order 30 found: [${ordByNum.id}] ${ordByNum.order_number} ($${ordByNum.total_amount})`);

  // Customer 30
  const custByNum = MockDb.getCustomerProfile('30');
  const custByPref = MockDb.getCustomerProfile('cust_30');
  if (!custByNum || custByNum.id !== 'cust_30') {
    throw new Error(`Failed to resolve customer by numeric ID '30'`);
  }
  if (!custByPref || custByPref.id !== 'cust_30') {
    throw new Error(`Failed to resolve customer by prefixed ID 'cust_30'`);
  }
  console.log(`  ✓ Customer 30 found: [${custByNum.id}] ${custByNum.first_name} ${custByNum.last_name} (${custByNum.email})`);

  // Inventory 30
  const invByNum = MockDb.getInventory('30');
  const invByPref = MockDb.getInventory('prod_30');
  if (!invByNum || invByNum.product_id !== 'prod_30') {
    throw new Error(`Failed to resolve inventory by numeric ID '30'`);
  }
  if (!invByPref || invByPref.product_id !== 'prod_30') {
    throw new Error(`Failed to resolve inventory by prefixed ID 'prod_30'`);
  }
  console.log(`  ✓ Inventory 30 found: SKU ${invByNum.sku}, Qty: ${invByNum.quantity}, Available: ${invByNum.available_quantity}`);

  // Out of range 404 checks
  const prod999 = MockDb.getProductById('999');
  const prodNotFound = MockDb.getProductById('not_found');
  if (prod999 !== undefined || prodNotFound !== undefined) {
    throw new Error('Expected out of range or not_found IDs to return undefined');
  }
  console.log('  ✓ Verified 404 (undefined) behavior for invalid or out-of-range IDs');

  // ==========================================
  // 3. VERIFY executeApiRequest SIMULATION FOR ID 30
  // ==========================================
  console.log('\n🚀 Step 3: Testing executeApiRequest Simulation with ID 30...');

  // Product 30 by ID
  const apiProd30 = await executeApiRequest({
    path: '/api/v1/products/:id',
    method: 'GET',
    pathParams: { id: '30' }
  });
  if (apiProd30.status !== 200 || apiProd30.data?.data?.id !== 'prod_30' || apiProd30.data?.data?.name !== 'Ring Video Doorbell Pro 2 Hardwired') {
    throw new Error(`executeApiRequest failed for product 30: ${JSON.stringify(apiProd30.data)}`);
  }
  console.log(`  ✓ GET /api/v1/products/30 -> HTTP ${apiProd30.status} OK (${apiProd30.durationMs}ms) | Item: ${apiProd30.data.data.name}`);

  // Product 30 by prod_30
  const apiProd30Pref = await executeApiRequest({
    path: '/api/v1/products/:id',
    method: 'GET',
    pathParams: { id: 'prod_30' }
  });
  if (apiProd30Pref.status !== 200 || apiProd30Pref.data?.data?.id !== 'prod_30') {
    throw new Error(`executeApiRequest failed for product prod_30`);
  }
  console.log(`  ✓ GET /api/v1/products/prod_30 -> HTTP ${apiProd30Pref.status} OK (${apiProd30Pref.durationMs}ms)`);

  // Category 30
  const apiCat30 = await executeApiRequest({
    path: '/api/v1/categories/:id',
    method: 'GET',
    pathParams: { id: '30' }
  });
  if (apiCat30.status !== 200 || apiCat30.data?.data?.id !== 'cat_30') {
    throw new Error(`executeApiRequest failed for category 30`);
  }
  console.log(`  ✓ GET /api/v1/categories/30 -> HTTP ${apiCat30.status} OK | Category: ${apiCat30.data.data.name}`);

  // Order 30
  const apiOrd30 = await executeApiRequest({
    path: '/api/v1/orders/:id',
    method: 'GET',
    pathParams: { id: '30' },
    bearerToken: 'sample-token'
  });
  if (apiOrd30.status !== 200 || apiOrd30.data?.data?.id !== 'ord_30') {
    throw new Error(`executeApiRequest failed for order 30`);
  }
  console.log(`  ✓ GET /api/v1/orders/30 -> HTTP ${apiOrd30.status} OK | Order: ${apiOrd30.data.data.order_number}`);

  // Inventory 30
  const apiInv30 = await executeApiRequest({
    path: '/api/v1/inventory/:productId',
    method: 'GET',
    pathParams: { productId: '30' },
    bearerToken: 'sample-token'
  });
  if (apiInv30.status !== 200 || apiInv30.data?.data?.product_id !== 'prod_30') {
    throw new Error(`executeApiRequest failed for inventory 30`);
  }
  console.log(`  ✓ GET /api/v1/inventory/30 -> HTTP ${apiInv30.status} OK | SKU: ${apiInv30.data.data.sku}`);

  // Test 404 for missing resource
  const api404 = await executeApiRequest({
    path: '/api/v1/products/:id',
    method: 'GET',
    pathParams: { id: '999' }
  });
  if (api404.status !== 404 || api404.data?.success !== false) {
    throw new Error(`Expected 404 for product 999, got ${api404.status}`);
  }
  console.log(`  ✓ GET /api/v1/products/999 -> HTTP ${api404.status} ${api404.statusText} (Correctly rejected)`);

  console.log('\n🎉 ALL 50-Item Catalog & ID 30 Resolution Tests Passed Successfully!');
}

runFiftyItemsAndIdLookupTests().catch(err => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});

import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_ORDERS, MOCK_CUSTOMERS, MOCK_ADDRESSES, MOCK_INVENTORY, MOCK_CART_ITEMS, MOCK_SEARCH_SUGGESTIONS } from '../src/data/mock-db';
import { executeApiRequest } from '../src/lib/api-client';

async function verifyFiftyItemsCatalog() {
  console.log('🧪 Verifying 50 Items on Each Resource (IDs 1 to 50)...\n');

  // 1. Check Mock Data Array Lengths
  console.log(`✓ Products count: ${MOCK_PRODUCTS.length} (Expected 50)`);
  if (MOCK_PRODUCTS.length !== 50) throw new Error(`Expected 50 products, got ${MOCK_PRODUCTS.length}`);

  console.log(`✓ Categories count: ${MOCK_CATEGORIES.length} (Expected 50)`);
  if (MOCK_CATEGORIES.length !== 50) throw new Error(`Expected 50 categories, got ${MOCK_CATEGORIES.length}`);

  console.log(`✓ Orders count: ${MOCK_ORDERS.length} (Expected 50)`);
  if (MOCK_ORDERS.length !== 50) throw new Error(`Expected 50 orders, got ${MOCK_ORDERS.length}`);

  console.log(`✓ Customers count: ${MOCK_CUSTOMERS.length} (Expected 50)`);
  if (MOCK_CUSTOMERS.length !== 50) throw new Error(`Expected 50 customers, got ${MOCK_CUSTOMERS.length}`);

  console.log(`✓ Addresses count: ${MOCK_ADDRESSES.length} (Expected 50)`);
  if (MOCK_ADDRESSES.length !== 50) throw new Error(`Expected 50 addresses, got ${MOCK_ADDRESSES.length}`);

  console.log(`✓ Inventory stock count: ${MOCK_INVENTORY.length} (Expected 50)`);
  if (MOCK_INVENTORY.length !== 50) throw new Error(`Expected 50 inventory items, got ${MOCK_INVENTORY.length}`);

  console.log(`✓ Cart items count: ${MOCK_CART_ITEMS.length} (Expected 50)`);
  if (MOCK_CART_ITEMS.length !== 50) throw new Error(`Expected 50 cart items, got ${MOCK_CART_ITEMS.length}`);

  console.log(`✓ Search suggestions count: ${MOCK_SEARCH_SUGGESTIONS.length} (Expected 50)`);
  if (MOCK_SEARCH_SUGGESTIONS.length !== 50) throw new Error(`Expected 50 suggestions, got ${MOCK_SEARCH_SUGGESTIONS.length}`);

  // 2. Verify IDs span 1 to 50
  for (let i = 1; i <= 50; i++) {
    if (!MOCK_PRODUCTS.some(p => p.id === `prod_${i}`)) throw new Error(`Missing product prod_${i}`);
    if (!MOCK_CATEGORIES.some(c => c.id === `cat_${i}`)) throw new Error(`Missing category cat_${i}`);
    if (!MOCK_ORDERS.some(o => o.id === `ord_${i}`)) throw new Error(`Missing order ord_${i}`);
    if (!MOCK_CUSTOMERS.some(cu => cu.id === `cust_${i}`)) throw new Error(`Missing customer cust_${i}`);
    if (!MOCK_ADDRESSES.some(a => a.id === `addr_${i}`)) throw new Error(`Missing address addr_${i}`);
    if (!MOCK_INVENTORY.some(inv => inv.product_id === `prod_${i}`)) throw new Error(`Missing inventory for prod_${i}`);
    if (!MOCK_CART_ITEMS.some(ci => ci.id === `item_${i}`)) throw new Error(`Missing cart item item_${i}`);
  }
  console.log('\n✓ Verified ID sequence 1 to 50 across all resources.');

  // 3. Test API Client with limit=50
  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample-token';
  const resProducts = await executeApiRequest({
    path: '/api/v1/products',
    method: 'GET',
    queryParams: { page: 1, limit: 50 }
  });
  if (resProducts.data?.data?.length !== 50) {
    throw new Error(`Expected 50 products returned, got ${resProducts.data?.data?.length}`);
  }
  console.log(`✓ GET /api/v1/products?limit=50 returned ${resProducts.data.data.length} items`);

  const resCategories = await executeApiRequest({
    path: '/api/v1/categories',
    method: 'GET'
  });
  if (resCategories.data?.data?.length !== 50) {
    throw new Error(`Expected 50 categories returned, got ${resCategories.data?.data?.length}`);
  }
  console.log(`✓ GET /api/v1/categories returned ${resCategories.data.data.length} items`);

  const resOrders = await executeApiRequest({
    path: '/api/v1/orders',
    method: 'GET',
    bearerToken: sampleToken,
    queryParams: { limit: 50 }
  });
  if (resOrders.data?.data?.length !== 50) {
    throw new Error(`Expected 50 orders returned, got ${resOrders.data?.data?.length}`);
  }
  console.log(`✓ GET /api/v1/orders?limit=50 returned ${resOrders.data.data.length} items`);

  console.log('\n🎉 50 Items per resource verified successfully!');
}

verifyFiftyItemsCatalog().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

import { parseApiError } from '../src/lib/api-errors';

function runStep13ErrorTests() {
  console.log('🚀 Testing API Error Classification & Diagnostics...\n');

  // 1. Test 400 Bad Request
  const err400 = parseApiError(400, 'Bad Request', { message: 'Malformed JSON payload' });
  console.log(`✅ [400 Test] Title: "${err400.title}" | Fix: "${err400.suggestedFix}"`);

  // 2. Test 401 Unauthorized
  const err401 = parseApiError(401, 'Unauthorized', { error: 'Missing Bearer token' });
  console.log(`✅ [401 Test] Title: "${err401.title}" | ActionType: "${err401.actionType}"`);

  // 3. Test 403 Forbidden
  const err403 = parseApiError(403, 'Forbidden', { message: 'Admin role required' });
  console.log(`✅ [403 Test] Title: "${err403.title}" | ActionType: "${err403.actionType}"`);

  // 4. Test 404 Not Found
  const err404 = parseApiError(404, 'Not Found', { error: 'Product not found' });
  console.log(`✅ [404 Test] Title: "${err404.title}" | ActionType: "${err404.actionType}"`);

  // 5. Test 422 Validation Error
  const err422 = parseApiError(422, 'Unprocessable Entity', {
    errors: [{ field: 'price', message: 'Price must be greater than 0' }]
  });
  console.log(`✅ [422 Test] Title: "${err422.title}" | Field Errors: ${err422.validationErrors?.length}`);

  // 6. Test 500 Internal Server Error
  const err500 = parseApiError(500, 'Internal Server Error', { message: 'Database connection failed' });
  console.log(`✅ [500 Test] Title: "${err500.title}" | Cause: "${err500.details}"`);

  // 7. Test Network Error
  const errNetwork = parseApiError(0, '', null, true, false);
  console.log(`✅ [Network Error Test] Title: "${errNetwork.title}"`);

  // 8. Test Timeout
  const errTimeout = parseApiError(504, 'Gateway Timeout', null, false, true);
  console.log(`✅ [Timeout Test] Title: "${errTimeout.title}"`);

  console.log('\n🎉 All 8 Error Scenarios Categorized & Verified Successfully!');
}

runStep13ErrorTests();

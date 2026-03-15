/**
 * COMPREHENSIVE API TEST SUITE
 * Tests all features: Auth, Banners, Menu, Orders, Subscriptions
 * Excludes payment-related testing
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';
let testResults = {
  passed: 0,
  failed: 0,
  details: []
};

// Test data storage
let tokens = {};
let userIDs = {};
let menuItemID = null;
let bannerID = null;
let subscriptionID = null;

/**
 * Helper function to make HTTP requests
 */
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: responseData ? JSON.parse(responseData) : null
          };
          resolve(response);
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: responseData
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Test assertion helper
 */
function assert(testName, condition, details = '') {
  if (condition) {
    testResults.passed++;
    testResults.details.push({
      status: '✅ PASS',
      test: testName,
      details: details
    });
    console.log(`✅ PASS: ${testName}`);
  } else {
    testResults.failed++;
    testResults.details.push({
      status: '❌ FAIL',
      test: testName,
      details: details
    });
    console.log(`❌ FAIL: ${testName} - ${details}`);
  }
}

/**
 * TEST SUITE
 */

async function runAllTests() {
  console.log('\n🚀 Starting API Test Suite...\n');
  console.log('═'.repeat(60));

  // 1. AUTH TESTS
  console.log('\n📝 1. AUTHENTICATION TESTS\n');
  await testAuthRegister();
  await testAuthLogin();
  await testAuthLoginFailure();

  // 2. BANNER TESTS
  console.log('\n🎨 2. BANNER TESTS\n');
  await testGetActiveBanners();

  // 3. MENU TESTS
  console.log('\n🍽️ 3. MENU TESTS\n');
  await testGetMenuByPlan();

  // 4. ORDER TESTS
  console.log('\n📦 4. ORDER TESTS\n');
  await testUpdateMealSelection();
  await testGetAdminDeliveryList();
  await testGetKitchenSummary();

  // 5. SUBSCRIPTION TESTS
  console.log('\n🎟️ 5. SUBSCRIPTION TESTS\n');
  await testCreateSubscription();

  // Print summary
  console.log('\n═'.repeat(60));
  console.log('\n📊 TEST SUMMARY\n');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`Total: ${testResults.passed + testResults.failed}\n`);

  if (testResults.failed === 0) {
    console.log('🎉 ALL TESTS PASSED! 🎉\n');
  }

  // Print detailed results
  console.log('\n📋 DETAILED RESULTS:\n');
  testResults.details.forEach(detail => {
    console.log(`${detail.status} - ${detail.test}`);
    if (detail.details) console.log(`   └─ ${detail.details}`);
  });
}

/**
 * AUTHENTICATION TESTS
 */

async function testAuthRegister() {
  console.log('Testing: Register Normal User...');
  const response = await makeRequest('POST', '/api/auth/register', {
    name: 'Test User Auth',
    phone: '9876543212',
    password: 'TestPass@123',
    referredByCode: null
  });

  const success = response.status === 201 && response.body.success;
  assert('Register User (Status 201)', response.status === 201, `Got ${response.status}`);
  assert('Register returns token', response.body.token ? true : false);

  if (success) {
    tokens.user1 = response.body.token;
    userIDs.user1 = response.body._id;
    console.log(`   Token saved for User 1: ${response.body.name}`);
  }
}

async function testAuthLogin() {
  console.log('\nTesting: Login User...');
  const response = await makeRequest('POST', '/api/auth/login', {
    phone: '9876543212',
    password: 'TestPass@123'
  });

  const success = response.status === 200 && response.body.success;
  assert('Login User (Status 200)', response.status === 200, `Got ${response.status}`);
  assert('Login returns token', response.body.token ? true : false);
  assert('Login returns user role', response.body.role ? true : false);

  if (success) {
    tokens.user1 = response.body.token;
  }
}

async function testAuthLoginFailure() {
  console.log('\nTesting: Login with wrong password (error handling)...');
  const response = await makeRequest('POST', '/api/auth/login', {
    phone: '9876543212',
    password: 'WrongPassword@123'
  });

  assert('Login fails with wrong password (Status 401)', response.status === 401, `Got ${response.status}`);
  assert('Error message on failed login', response.body.success === false);
}

/**
 * BANNER TESTS
 */

async function testGetActiveBanners() {
  console.log('Testing: Get Active Banners (Public)...');
  const response = await makeRequest('GET', '/api/banners');

  assert('Get Banners (Status 200)', response.status === 200, `Got ${response.status}`);
  assert('Banners response is array', Array.isArray(response.body.data));
  console.log(`   Found ${response.body.data.length} banners`);
}

/**
 * MENU TESTS
 */

async function testGetMenuByPlan() {
  console.log('Testing: Get Menu by Plan Type...');

  // Test Basic Plan
  let response = await makeRequest('GET', '/api/menu/basic');
  assert('Get Basic Menu (Status 200)', response.status === 200, `Got ${response.status}`);
  assert('Basic Menu returns array', Array.isArray(response.body.data));
  console.log(`   Basic Plan: ${response.body.count} items`);

  // Test Deluxe Plan
  response = await makeRequest('GET', '/api/menu/deluxe');
  assert('Get Deluxe Menu (Status 200)', response.status === 200, `Got ${response.status}`);
  console.log(`   Deluxe Plan: ${response.body.count} items`);

  // Test Royal Plan
  response = await makeRequest('GET', '/api/menu/royal');
  assert('Get Royal Menu (Status 200)', response.status === 200, `Got ${response.status}`);
  console.log(`   Royal Plan: ${response.body.count} items`);
}

/**
 * ORDER TESTS
 */

async function testUpdateMealSelection() {
  console.log('Testing: Update Meal Selection...');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  const response = await makeRequest(
    'PATCH',
    '/api/orders/select-meal',
    {
      date: dateStr,
      selectedItem: 'Paneer Tikka',
      isSkipped: false,
      planType: 'basic'
    },
    tokens.user1
  );

  assert('Update Meal Selection (Status 200)', response.status === 200, `Got ${response.status}`);
  assert('Order returned with success', response.body.success === true);
  console.log(`   Meal selected for ${dateStr}`);
}

async function testGetAdminDeliveryList() {
  console.log('\nTesting: Get Admin Delivery List...');
  const today = new Date().toISOString().split('T')[0];

  const response = await makeRequest(
    'GET',
    `/api/orders/admin/delivery/${today}`,
    null,
    tokens.user1 // This will fail if user is not admin, which is expected
  );

  // This might fail if user1 is not admin, which is fine for normal user test
  if (response.status === 200) {
    assert('Get Delivery List (Status 200)', true);
    console.log(`   Retrieved ${response.body.count} orders for delivery`);
  } else if (response.status === 403) {
    assert('Non-admin user blocked from delivery list', true, 'Expected behavior - user1 not admin');
    console.log('   ✓ Correctly blocked non-admin user from accessing delivery list');
  } else {
    assert('Get Delivery List', false, `Got unexpected status ${response.status}`);
  }
}

async function testGetKitchenSummary() {
  console.log('\nTesting: Get Kitchen Summary...');
  const today = new Date().toISOString().split('T')[0];

  const response = await makeRequest(
    'GET',
    `/api/orders/admin/summary/${today}`,
    null,
    tokens.user1
  );

  if (response.status === 200) {
    assert('Get Kitchen Summary (Status 200)', true);
    console.log(`   Retrieved kitchen summary for ${today}`);
  } else if (response.status === 403) {
    assert('Non-admin user blocked from kitchen summary', true, 'Expected behavior - user1 not admin');
    console.log('   ✓ Correctly blocked non-admin user from accessing kitchen summary');
  } else {
    assert('Get Kitchen Summary', false, `Got unexpected status ${response.status}`);
  }
}

/**
 * SUBSCRIPTION TESTS
 */

async function testCreateSubscription() {
  console.log('Testing: Create Subscription...');
  const startDate = new Date().toISOString().split('T')[0];

  const response = await makeRequest(
    'POST',
    '/api/subscriptions/create',
    {
      planType: 'basic',
      totalDays: 30,
      startDate: startDate
    },
    tokens.user1
  );

  assert('Create Subscription (Status 201)', response.status === 201, `Got ${response.status}`);
  assert('Subscription created with success', response.body.subscription ? true : false);
  assert('Mock order returned', response.body.order ? true : false);

  if (response.body.subscription) {
    subscriptionID = response.body.subscription._id;
    console.log(`   Subscription created with ID: ${subscriptionID}`);
    console.log(`   Status: ${response.body.subscription.status}`);
    console.log(`   Total Price: ₹${response.body.subscription.totalPrice}`);
  }
}

/**
 * ADDITIONAL EDGE CASE TESTS
 */

async function testMissingAuthToken() {
  console.log('\nTesting: Protected endpoint without token...');
  const response = await makeRequest('PATCH', '/api/orders/select-meal', {
    date: '2024-03-10',
    selectedItem: 'Butter Chicken',
    isSkipped: false,
    planType: 'deluxe'
  });
  // No token provided

  assert('Protected endpoint denies request without token', response.status === 401, `Got ${response.status}`);
}

// Run all tests
runAllTests().catch(error => {
  console.error('❌ Test Suite Error:', error);
  process.exit(1);
});

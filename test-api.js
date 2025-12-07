#!/usr/bin/env node

const http = require('http');

const tests = [];

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: `/api/v1${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 TESTING SENTIMENT API ENDPOINTS\n' + '='.repeat(70));
  
  let token = '';
  let sentimentId = '';
  const randomId = Math.floor(Math.random() * 100000);

  // Test 1: Signup
  console.log('\n✏️  TEST 1: User Signup');
  try {
    const signupRes = await makeRequest('POST', '/users/signup', {
      email: `testuser${randomId}@test.com`,
      password: 'TestPassword123',
      name: 'Test User'
    });
    console.log(`Status: ${signupRes.status}`);
    if (signupRes.status === 201 || signupRes.status === 200) {
      console.log('✅ Signup successful\n');
    } else {
      console.log('❌ Signup failed:', signupRes.data, '\n');
    }
  } catch (e) {
    console.log('❌ Error:', e.message, '\n');
  }

  // Test 2: Login
  console.log('✏️  TEST 2: User Login');
  try {
    const loginRes = await makeRequest('POST', '/users/login', {
      email: `testuser${randomId}@test.com`,
      password: 'TestPassword123'
    });
    console.log(`Status: ${loginRes.status}`);
    if (loginRes.status === 200 && loginRes.data.accessToken) {
      token = loginRes.data.accessToken;
      console.log('✅ Login successful');
      console.log(`Token: ${token.substring(0, 30)}...\n`);
    } else {
      console.log('⚠️  Login response:', loginRes.data, '\n');
      process.exit(1);
    }
  } catch (e) {
    console.log('❌ Error:', e.message, '\n');
    process.exit(1);
  }

  // Test 3: POST - Save Sentiment
  console.log('✏️  TEST 3: POST /sentiment - Save Sentiment');
  try {
    const saveRes = await makeRequest('POST', '/analysis/sentiment', {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      label: 'positive',
      score: 0.9425
    }, token);
    console.log(`Status: ${saveRes.status}`);
    if (saveRes.status === 201) {
      sentimentId = saveRes.data.data?._id;
      console.log('✅ Save Sentiment Success');
      console.log('Response:', JSON.stringify(saveRes.data, null, 2) + '\n');
    } else {
      console.log('❌ Failed:', saveRes.data, '\n');
    }
  } catch (e) {
    console.log('❌ Error:', e.message, '\n');
  }

  // Test 4: GET - Get All Sentiments
  console.log('✏️  TEST 4: GET / - Get All Sentiments');
  try {
    const getAllRes = await makeRequest('GET', '/analysis', null, token);
    console.log(`Status: ${getAllRes.status}`);
    if (getAllRes.status === 200) {
      const count = getAllRes.data.data?.length || 0;
      console.log('✅ Get All Success');
      console.log(`Found ${count} sentiments\n`);
    } else {
      console.log('❌ Failed:', getAllRes.data, '\n');
    }
  } catch (e) {
    console.log('❌ Error:', e.message, '\n');
  }

  // Test 5: GET - Filter by Type
  console.log('✏️  TEST 5: GET /sentiment/positive - Filter by Type');
  try {
    const filterRes = await makeRequest('GET', '/analysis/sentiment/positive', null, token);
    console.log(`Status: ${filterRes.status}`);
    if (filterRes.status === 200) {
      const count = filterRes.data.data?.length || 0;
      console.log('✅ Filter Success');
      console.log(`Found ${count} positive sentiments\n`);
    } else {
      console.log('❌ Failed:', filterRes.data, '\n');
    }
  } catch (e) {
    console.log('❌ Error:', e.message, '\n');
  }

  // Test 6: GET - Get Single
  if (sentimentId) {
    console.log(`✏️  TEST 6: GET /${sentimentId} - Get Single Sentiment`);
    try {
      const singleRes = await makeRequest('GET', `/analysis/${sentimentId}`, null, token);
      console.log(`Status: ${singleRes.status}`);
      if (singleRes.status === 200) {
        console.log('✅ Get Single Success');
        console.log('Response:', JSON.stringify(singleRes.data.data, null, 2) + '\n');
      } else {
        console.log('❌ Failed:', singleRes.data, '\n');
      }
    } catch (e) {
      console.log('❌ Error:', e.message, '\n');
    }
  }

  // Test 7: GET - Statistics
  console.log('✏️  TEST 7: GET /stats - Get Statistics');
  try {
    const statsRes = await makeRequest('GET', '/analysis/stats', null, token);
    console.log(`Status: ${statsRes.status}`);
    if (statsRes.status === 200) {
      console.log('✅ Stats Success');
      console.log('Response:', JSON.stringify(statsRes.data.data, null, 2) + '\n');
    } else {
      console.log('❌ Failed:', statsRes.data, '\n');
    }
  } catch (e) {
    console.log('❌ Error:', e.message, '\n');
  }

  // Test 8: POST - Save Negative Sentiment
  console.log('✏️  TEST 8: POST /sentiment - Save Negative Sentiment');
  try {
    const negRes = await makeRequest('POST', '/analysis/sentiment', {
      videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      label: 'negative',
      score: 0.8156
    }, token);
    console.log(`Status: ${negRes.status}`);
    if (negRes.status === 201) {
      console.log('✅ Save Negative Success\n');
    } else {
      console.log('❌ Failed:', negRes.data, '\n');
    }
  } catch (e) {
    console.log('❌ Error:', e.message, '\n');
  }

  // Test 9: DELETE
  if (sentimentId) {
    console.log(`✏️  TEST 9: DELETE /${sentimentId} - Delete Sentiment`);
    try {
      const deleteRes = await makeRequest('DELETE', `/analysis/${sentimentId}`, null, token);
      console.log(`Status: ${deleteRes.status}`);
      if (deleteRes.status === 200) {
        console.log('✅ Delete Success\n');
      } else {
        console.log('❌ Failed:', deleteRes.data, '\n');
      }
    } catch (e) {
      console.log('❌ Error:', e.message, '\n');
    }
  }

  // Test 10: Authorization Check
  console.log('✏️  TEST 10: Missing Authorization (should fail with 401)');
  try {
    const noAuthRes = await makeRequest('GET', '/analysis', null, null);
    console.log(`Status: ${noAuthRes.status}`);
    if (noAuthRes.status === 401) {
      console.log('✅ Correctly rejected unauthorized request\n');
    } else {
      console.log('⚠️  Expected 401, got', noAuthRes.status, '\n');
    }
  } catch (e) {
    console.log('❌ Error:', e.message, '\n');
  }

  console.log('='.repeat(70));
  console.log('✅ ALL TESTS COMPLETED\n');
}

runTests().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});

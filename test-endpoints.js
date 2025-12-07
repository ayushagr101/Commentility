#!/usr/bin/env node

import http from 'http';
import https from 'https';

const API_BASE = 'http://localhost:8000/api/v1';

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const method = options.method || 'GET';
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const client = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);

    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method,
      headers,
      timeout: 5000,
    };

    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, data: null, raw: data });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ status: 0, error: e.message, data: null });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, error: 'Timeout', data: null });
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function test(title, method, path, body = null, token = null) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  process.stdout.write(`\n${title}\n`);
  process.stdout.write('  ');

  const res = await request(`${API_BASE}${path}`, {
    method,
    headers,
    body,
  });

  if (res.error) {
    console.log(`❌ Error: ${res.error}`);
    return null;
  }

  if (res.status >= 200 && res.status < 300) {
    console.log(`✅ ${res.status}`);
    return res.data;
  } else {
    console.log(`⚠️  ${res.status}`);
    if (res.data?.message) console.log(`     ${res.data.message}`);
    return null;
  }
}

async function runTests() {
  console.log('\n🧪 SENTIMENT API TEST SUITE');
  console.log('='.repeat(70));

  let token = '';
  let sentimentId = '';
  const rand = Math.floor(Math.random() * 100000);

  // Test 1: Signup
  const signupRes = await test(
    '1️⃣  POST /users/signup',
    'POST',
    '/users/signup',
    { email: `test${rand}@test.com`, password: 'Password123', name: 'Test' }
  );

  // Test 2: Login
  const loginRes = await test(
    '2️⃣  POST /users/login',
    'POST',
    '/users/login',
    { email: `test${rand}@test.com`, password: 'Password123' }
  );

  if (loginRes?.accessToken) {
    token = loginRes.accessToken;
    console.log(`     Token: ${token.substring(0, 20)}...`);
  } else {
    console.log('     ⚠️  No token received, cannot continue');
    process.exit(1);
  }

  // Test 3: Save Sentiment
  const saveRes = await test(
    '3️⃣  POST /analysis/sentiment',
    'POST',
    '/analysis/sentiment',
    { videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', label: 'positive', score: 0.9425 },
    token
  );

  if (saveRes?.data?._id) {
    sentimentId = saveRes.data._id;
    console.log(`     Saved ID: ${sentimentId}`);
  }

  // Test 4: Get All
  const getAllRes = await test(
    '4️⃣  GET /analysis',
    'GET',
    '/analysis',
    null,
    token
  );

  if (Array.isArray(getAllRes?.data)) {
    console.log(`     Found: ${getAllRes.data.length} sentiments`);
  }

  // Test 5: Filter by Type
  const filterRes = await test(
    '5️⃣  GET /analysis/sentiment/positive',
    'GET',
    '/analysis/sentiment/positive',
    null,
    token
  );

  if (Array.isArray(filterRes?.data)) {
    console.log(`     Found: ${filterRes.data.length} positive`);
  }

  // Test 6: Get Single
  if (sentimentId) {
    const singleRes = await test(
      `6️⃣  GET /analysis/${sentimentId}`,
      'GET',
      `/analysis/${sentimentId}`,
      null,
      token
    );

    if (singleRes?.data?.sentiment) {
      console.log(`     Sentiment: ${singleRes.data.sentiment} (${singleRes.data.score})`);
    }
  }

  // Test 7: Stats
  const statsRes = await test(
    '7️⃣  GET /analysis/stats',
    'GET',
    '/analysis/stats',
    null,
    token
  );

  if (statsRes?.data) {
    console.log(`     Stats received`);
  }

  // Test 8: Save Another
  const save2Res = await test(
    '8️⃣  POST /analysis/sentiment (negative)',
    'POST',
    '/analysis/sentiment',
    { videoUrl: 'https://youtube.com/watch?v=jNQXAC9IVRw', label: 'negative', score: 0.8156 },
    token
  );

  // Test 9: Delete
  if (sentimentId) {
    await test(
      `9️⃣  DELETE /analysis/${sentimentId}`,
      'DELETE',
      `/analysis/${sentimentId}`,
      null,
      token
    );
  }

  // Test 10: No Auth
  const noAuthRes = await test(
    '🔟 GET /analysis (no token - should fail)',
    'GET',
    '/analysis'
  );

  console.log('\n' + '='.repeat(70));
  console.log('✅ TEST SUITE COMPLETE\n');
}

runTests().catch(console.error);

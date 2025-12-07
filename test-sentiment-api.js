import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

let testToken = '';
let userId = '';
let sentimentId = '';

const testEmail = `testuser${Date.now()}@test.com`;
const testPassword = 'TestPassword123';

async function log(title, data) {
  console.log('\n' + '='.repeat(70));
  console.log(`✅ ${title}`);
  console.log('='.repeat(70));
  console.log(JSON.stringify(data, null, 2));
}

async function logError(title, error) {
  console.log('\n' + '='.repeat(70));
  console.log(`❌ ${title}`);
  console.log('='.repeat(70));
  if (error.response) {
    console.log(`Status: ${error.response.status}`);
    console.log(JSON.stringify(error.response.data, null, 2));
  } else {
    console.log(error.message);
  }
}

async function runTests() {
  try {
    // 1. Signup
    console.log('\n🧪 TEST 1: User Signup');
    const signupRes = await axios.post(`${API_BASE}/users/signup`, {
      email: testEmail,
      password: testPassword,
      name: 'Test User'
    }).catch(e => e.response);

    if (signupRes.status === 201 || signupRes.status === 200) {
      const signupData = signupRes.data;
      userId = signupData.userId || signupData.user?._id || 'unknown';
      await log('Signup Success', { email: testEmail, userId });
    } else {
      await logError('Signup Failed', { status: signupRes.status, data: signupRes.data });
      return;
    }

    // 2. Login
    console.log('\n🧪 TEST 2: User Login');
    const loginRes = await axios.post(`${API_BASE}/users/login`, {
      email: testEmail,
      password: testPassword
    }).catch(e => e.response);

    if (loginRes.status === 200) {
      const loginData = loginRes.data;
      testToken = loginData.accessToken || loginData.token || '';
      await log('Login Success', { token: testToken.substring(0, 20) + '...' });
    } else {
      await logError('Login Failed', loginRes);
      return;
    }

    if (!testToken) {
      console.log('❌ No token received from login');
      return;
    }

    const headers = { Authorization: `Bearer ${testToken}` };

    // 3. POST - Save Sentiment
    console.log('\n🧪 TEST 3: POST /api/v1/analysis/sentiment - Save Sentiment');
    const saveRes = await axios.post(
      `${API_BASE}/analysis/sentiment`,
      {
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        label: 'positive',
        score: 0.9425275325775146
      },
      { headers }
    ).catch(e => e.response);

    if (saveRes.status === 201) {
      const savedData = saveRes.data.data || saveRes.data;
      sentimentId = savedData._id;
      await log('Save Sentiment Success', savedData);
    } else {
      await logError('Save Sentiment Failed', saveRes);
    }

    // 4. GET - Get All Sentiments
    console.log('\n🧪 TEST 4: GET /api/v1/analysis - Get All Sentiments');
    const getAllRes = await axios.get(`${API_BASE}/analysis`, { headers }).catch(e => e.response);

    if (getAllRes.status === 200) {
      const responseData = getAllRes.data.data || getAllRes.data;
      await log('Get All Sentiments Success', {
        count: Array.isArray(responseData) ? responseData.length : responseData.data?.length,
        data: Array.isArray(responseData) ? responseData.slice(0, 2) : responseData.data?.slice(0, 2)
      });
    } else {
      await logError('Get All Sentiments Failed', getAllRes);
    }

    // 5. GET - Get by Type
    console.log('\n🧪 TEST 5: GET /api/v1/analysis/sentiment/positive - Filter by Type');
    const getByTypeRes = await axios.get(`${API_BASE}/analysis/sentiment/positive`, { headers }).catch(e => e.response);

    if (getByTypeRes.status === 200) {
      const typeData = getByTypeRes.data.data || getByTypeRes.data;
      await log('Get By Type Success', {
        type: 'positive',
        count: Array.isArray(typeData) ? typeData.length : typeData.data?.length,
        data: Array.isArray(typeData) ? typeData.slice(0, 1) : typeData.data?.slice(0, 1)
      });
    } else {
      await logError('Get By Type Failed', getByTypeRes);
    }

    // 6. GET - Get Single Sentiment
    if (sentimentId) {
      console.log('\n🧪 TEST 6: GET /api/v1/analysis/:id - Get Single Sentiment');
      const getSingleRes = await axios.get(`${API_BASE}/analysis/${sentimentId}`, { headers }).catch(e => e.response);

      if (getSingleRes.status === 200) {
        const singleData = getSingleRes.data.data || getSingleRes.data;
        await log('Get Single Sentiment Success', singleData);
      } else {
        await logError('Get Single Sentiment Failed', getSingleRes);
      }
    }

    // 7. GET - Statistics
    console.log('\n🧪 TEST 7: GET /api/v1/analysis/stats - Get Statistics');
    const statsRes = await axios.get(`${API_BASE}/analysis/stats`, { headers }).catch(e => e.response);

    if (statsRes.status === 200) {
      const statsData = statsRes.data.data || statsRes.data;
      await log('Get Statistics Success', statsData);
    } else {
      await logError('Get Statistics Failed', statsRes);
    }

    // 8. POST - Save Another Sentiment (negative)
    console.log('\n🧪 TEST 8: POST - Save Negative Sentiment');
    const saveNegRes = await axios.post(
      `${API_BASE}/analysis/sentiment`,
      {
        videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        label: 'negative',
        score: 0.8156
      },
      { headers }
    ).catch(e => e.response);

    if (saveNegRes.status === 201) {
      const negData = saveNegRes.data.data || saveNegRes.data;
      await log('Save Negative Sentiment Success', negData);
    } else {
      await logError('Save Negative Sentiment Failed', saveNegRes);
    }

    // 9. DELETE - Delete Sentiment
    if (sentimentId) {
      console.log('\n🧪 TEST 9: DELETE /api/v1/analysis/:id - Delete Sentiment');
      const deleteRes = await axios.delete(`${API_BASE}/analysis/${sentimentId}`, { headers }).catch(e => e.response);

      if (deleteRes.status === 200) {
        await log('Delete Sentiment Success', { message: 'Sentiment deleted', id: sentimentId });
      } else {
        await logError('Delete Sentiment Failed', deleteRes);
      }
    }

    // 10. Error Cases
    console.log('\n🧪 TEST 10: Error Handling - Missing Authorization');
    const noAuthRes = await axios.get(`${API_BASE}/analysis`).catch(e => e.response);
    if (noAuthRes.status === 401) {
      await log('Missing Auth - Correctly Rejected (401)', noAuthRes.data);
    } else {
      console.log('⚠️  Expected 401, got:', noAuthRes.status);
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL TESTS COMPLETED');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('Test suite error:', error.message);
    process.exit(1);
  }
}

runTests();

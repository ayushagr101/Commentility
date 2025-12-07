import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const testUser = {
  email: 'testuser@example.com',
  password: 'Test123!@#'
};

const api = axios.create({
  baseURL: API_URL,
  validateStatus: () => true,
  withCredentials: true
});

async function runTests() {
  console.log('🚀 Testing Video Sentiment API\n');

  try {
    // 1. Login
    console.log('1️⃣ Login...');
    const loginRes = await api.post('/users/login', testUser);
    console.log(`   Status: ${loginRes.status}`);
    
    if (loginRes.status !== 200) {
      console.log('   ⚠️ Login failed, trying signup...');
      const signupRes = await api.post('/users/signup', testUser);
      console.log(`   Signup Status: ${signupRes.status}`);
    }

    // Get token from cookies for Bearer auth
    const setCookieHeaders = loginRes.headers['set-cookie'] || [];
    let token = null;
    for (const cookie of setCookieHeaders) {
      if (cookie.startsWith('accessToken=')) {
        token = cookie.split(';')[0].replace('accessToken=', '');
        break;
      }
    }

    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // 2. Save sentiment from ML model output
    console.log('\n2️⃣ Save sentiment analysis result...');
    const sentimentRes = await api.post('/analysis/sentiment', {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      label: 'positive',
      score: 0.9425275325775146
    });
    console.log(`   Status: ${sentimentRes.status}`);
    if (sentimentRes.status === 201) {
      console.log(`   ✅ Saved with ID: ${sentimentRes.data.data._id}`);
      console.log(`   Sentiment: ${sentimentRes.data.data.sentiment}`);
      console.log(`   Score: ${sentimentRes.data.data.score}`);
    } else {
      console.log(`   ❌ Error: ${sentimentRes.data.message}`);
    }

    // 3. Save another sentiment
    console.log('\n3️⃣ Save another sentiment...');
    const sentiment2Res = await api.post('/analysis/sentiment', {
      videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      label: 'negative',
      score: 0.3
    });
    console.log(`   Status: ${sentiment2Res.status}`);

    // 4. Get all sentiments
    console.log('\n4️⃣ Get all sentiments...');
    const allRes = await api.get('/analysis');
    console.log(`   Status: ${allRes.status}`);
    console.log(`   Total: ${allRes.data.pagination?.total}`);
    console.log(`   Records: ${allRes.data.data?.length}`);

    // 5. Filter by sentiment type
    console.log('\n5️⃣ Filter by positive sentiment...');
    const positiveRes = await api.get('/analysis/sentiment/positive');
    console.log(`   Status: ${positiveRes.status}`);
    console.log(`   Found: ${positiveRes.data.data?.length} positive records`);

    console.log('\n6️⃣ Filter by negative sentiment...');
    const negativeRes = await api.get('/analysis/sentiment/negative');
    console.log(`   Status: ${negativeRes.status}`);
    console.log(`   Found: ${negativeRes.data.data?.length} negative records`);

    // 6. Get statistics
    console.log('\n7️⃣ Get sentiment statistics...');
    const statsRes = await api.get('/analysis/stats');
    console.log(`   Status: ${statsRes.status}`);
    if (statsRes.data.data) {
      console.log(`   Stats: ${JSON.stringify(statsRes.data.data)}`);
    }

    console.log('\n✨ All tests completed!\n');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

runTests();

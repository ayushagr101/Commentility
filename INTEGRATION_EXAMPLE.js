/**
 * ML Model Integration Example
 * Shows how to send sentiment analysis to your backend
 */

// ==========================================
// YOUR ML MODEL OUTPUT FORMAT
// ==========================================
const mlModelOutput = [
  { 'label': 'positive', 'score': 0.9425275325775146 },
  { 'label': 'negative', 'score': 0.0423945234 },
  { 'label': 'neutral', 'score': 0.0150779422 }
];

// ==========================================
// EXTRACT TOP SENTIMENT
// ==========================================
function extractSentiment(mlOutput) {
  // Find the highest scoring sentiment
  let topSentiment = mlOutput.reduce((prev, current) => 
    (prev.score > current.score) ? prev : current
  );
  
  return {
    label: topSentiment.label,
    score: topSentiment.score
  };
}

const sentiment = extractSentiment(mlModelOutput);
console.log('📊 ML Model Output:', mlModelOutput);
console.log('✅ Extracted:', sentiment);

// ==========================================
// SEND TO BACKEND
// ==========================================
async function sendSentimentToBackend(videoUrl, sentiment, userToken) {
  const apiEndpoint = 'http://localhost:8000/api/v1/analysis/sentiment';
  
  const payload = {
    videoUrl: videoUrl,
    label: sentiment.label,      // 'positive', 'negative', or 'neutral'
    score: sentiment.score       // 0.0 to 1.0
  };

  console.log('\n📤 Sending to backend:');
  console.log('Endpoint:', apiEndpoint);
  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✨ Success!');
      console.log('Status:', response.status);
      console.log('Saved Record ID:', data.data._id);
      console.log('Sentiment:', data.data.sentiment);
      console.log('Score:', data.data.score);
      console.log('Timestamp:', data.data.createdAt);
      return data.data;
    } else {
      console.log('\n❌ Error:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return null;
  }
}

// ==========================================
// RETRIEVE RESULTS
// ==========================================
async function getSentimentResults(userToken, filterType = null) {
  let endpoint = 'http://localhost:8000/api/v1/analysis';
  
  if (filterType) {
    endpoint = `http://localhost:8000/api/v1/analysis/sentiment/${filterType}`;
  }

  console.log('\n📥 Retrieving sentiments:');
  console.log('Endpoint:', endpoint);

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Retrieved:');
      if (filterType) {
        console.log(`Found ${data.data?.length || 0} ${filterType} sentiments`);
        data.data?.forEach(record => {
          console.log(`  • ${record.videoUrl.substring(0, 50)}... - Score: ${record.score}`);
        });
      } else {
        console.log(`Total: ${data.pagination?.total} records`);
        console.log(`Page size: ${data.data?.length || 0}`);
      }
      return data;
    } else {
      console.log('\n❌ Error:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return null;
  }
}

// ==========================================
// EXAMPLE WORKFLOW
// ==========================================
async function exampleWorkflow() {
  console.log('🚀 Video Sentiment Analysis Workflow\n');
  console.log('=====================================\n');

  // Step 1: User provides video URL
  const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  console.log('1️⃣ User submits video:', videoUrl);

  // Step 2: ML model analyzes and produces output
  console.log('\n2️⃣ ML model analyzes...');
  console.log('   Raw output:', mlModelOutput);

  // Step 3: Extract top sentiment
  const topSentiment = extractSentiment(mlModelOutput);
  console.log('\n3️⃣ Top sentiment extracted:');
  console.log(`   Label: ${topSentiment.label}`);
  console.log(`   Score: ${topSentiment.score.toFixed(4)}`);

  // Step 4: Send to backend
  console.log('\n4️⃣ Sending to backend...');
  // In real usage, replace 'YOUR_JWT_TOKEN' with actual token
  // await sendSentimentToBackend(videoUrl, topSentiment, 'YOUR_JWT_TOKEN');

  // Step 5: Retrieve and display
  console.log('\n5️⃣ Later, retrieve results...');
  // await getSentimentResults('YOUR_JWT_TOKEN', 'positive');

  console.log('\n✨ Workflow complete!');
}

// ==========================================
// EXPORT FOR USE IN OTHER FILES
// ==========================================
export { 
  extractSentiment, 
  sendSentimentToBackend, 
  getSentimentResults 
};

// Run example if executed directly
console.log('\n📝 INTEGRATION EXAMPLE\n');
exampleWorkflow();

console.log('\n\n📚 INTEGRATION NOTES:\n');
console.log('1. Your ML model produces labels: positive, negative, neutral');
console.log('2. Extract the highest scoring one');
console.log('3. Send via POST /api/v1/analysis/sentiment');
console.log('4. Backend stores with userId, videoUrl, timestamp');
console.log('5. Query results anytime with GET endpoints\n');

console.log('💡 TIP: Use the exported functions in your code:');
console.log('   import { sendSentimentToBackend } from "./integration.js";');
console.log('   await sendSentimentToBackend(url, sentiment, token);\n');

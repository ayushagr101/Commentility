/**
 * Schema and API Endpoint Documentation
 * Demonstrates the simplified VideoSentiment schema
 */

console.log('\n📋 VideoSentiment Schema Structure:');
console.log('=====================================\n');

console.log('✅ Fields:');
console.log('  • userId (ObjectId) - References User, indexed');
console.log('  • videoUrl (String) - Video URL from your platform');
console.log('  • videoId (String) - Extracted YouTube video ID, indexed');
console.log('  • sentiment (String) - Enum: positive, negative, neutral, indexed');
console.log('  • score (Number) - 0-1 value from ML model');
console.log('  • createdAt (Date) - Auto timestamp');
console.log('  • updatedAt (Date) - Auto timestamp');

console.log('\n📊 Example Record:');
console.log('=====================================\n');

const exampleRecord = {
  _id: '507f1f77bcf86cd799439011',
  userId: '507f1f77bcf86cd799439012',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  videoId: 'dQw4w9WgXcQ',
  sentiment: 'positive',
  score: 0.9425275325775146,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

console.log(JSON.stringify(exampleRecord, null, 2));

console.log('\n🔗 API Endpoints:');
console.log('=====================================\n');

console.log('1️⃣ POST /api/v1/analysis/sentiment');
console.log('   Save sentiment from ML model');
console.log('   Request:');
console.log('   {');
console.log('     "videoUrl": "https://www.youtube.com/watch?v=...",');
console.log('     "label": "positive",');
console.log('     "score": 0.9425275325775146');
console.log('   }');
console.log('   Response: 201 Created with saved record\n');

console.log('2️⃣ GET /api/v1/analysis');
console.log('   Get all user sentiments (paginated)');
console.log('   Query: ?limit=20&skip=0');
console.log('   Response: Array of VideoSentiment records with pagination\n');

console.log('3️⃣ GET /api/v1/analysis/sentiment/:type');
console.log('   Filter by sentiment type');
console.log('   Types: positive, negative, neutral');
console.log('   Response: Array of filtered records\n');

console.log('4️⃣ GET /api/v1/analysis/:id');
console.log('   Get single sentiment record');
console.log('   Response: Single VideoSentiment record\n');

console.log('5️⃣ DELETE /api/v1/analysis/:id');
console.log('   Delete sentiment record');
console.log('   Response: Success message\n');

console.log('6️⃣ GET /api/v1/analysis/stats');
console.log('   Get sentiment statistics for user');
console.log('   Response: Aggregated sentiment counts and average scores\n');

console.log('✨ Schema and API ready for your ML model integration!\n');

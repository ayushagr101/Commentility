# 🎯 Video Sentiment Analysis - Schema & API Documentation

## ✅ Schema Created: `VideoSentiment`

Your new simplified schema stores exactly what you need:

### Database Fields

```javascript
{
  _id: ObjectId,                    // MongoDB auto ID
  userId: ObjectId,                 // User who submitted this analysis
  videoUrl: String,                 // Video URL (e.g., YouTube link)
  videoId: String,                  // Extracted video ID (indexed)
  sentiment: String,                // "positive", "negative", or "neutral"
  score: Number,                    // 0.0 to 1.0 (from your ML model)
  createdAt: Date,                  // Auto timestamp
  updatedAt: Date                   // Auto timestamp
}
```

### Key Features

✅ **Simple & Lightweight** - Only stores what you need  
✅ **User-based** - Each record belongs to a specific user  
✅ **Indexed** - Fast queries on userId, sentiment, and videoId  
✅ **Timestamps** - Automatic creation/update tracking  
✅ **Timestamp Support** - Both createdAt and updatedAt included

---

## 📝 ML Model Integration

Your ML model outputs:
```python
[{'label': 'positive', 'score': 0.9425275325775146}]
```

### How to Send to Backend

Send an HTTP POST request:

```bash
curl -X POST http://localhost:8000/api/v1/analysis/sentiment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "label": "positive",
    "score": 0.9425275325775146
  }'
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Sentiment saved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "videoId": "dQw4w9WgXcQ",
    "sentiment": "positive",
    "score": 0.9425275325775146,
    "createdAt": "2025-12-07T18:18:06.721Z",
    "updatedAt": "2025-12-07T18:18:06.723Z"
  }
}
```

---

## 🔗 API Endpoints

### 1. Save Sentiment Analysis
**POST** `/api/v1/analysis/sentiment`

Save sentiment result from your ML model.

**Request:**
```json
{
  "videoUrl": "string (required)",
  "label": "string (required) - positive, negative, or neutral",
  "score": "number (required) - between 0 and 1"
}
```

**Response:** 201 Created with saved record

---

### 2. Get All Sentiments
**GET** `/api/v1/analysis?limit=20&skip=0`

Retrieve all sentiment records for current user (paginated).

**Query Parameters:**
- `limit` - Results per page (default: 20)
- `skip` - Number of records to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [...array of sentiment records...],
  "pagination": {
    "total": 42,
    "limit": 20,
    "skip": 0,
    "hasMore": true
  }
}
```

---

### 3. Filter by Sentiment Type
**GET** `/api/v1/analysis/sentiment/:type`

Filter records by sentiment type (positive, negative, or neutral).

**URL Parameters:**
- `type` - "positive", "negative", or "neutral"

**Response:**
```json
{
  "success": true,
  "data": [...filtered records...],
  "count": 12
}
```

**Example:**
```bash
# Get all positive sentiments
GET /api/v1/analysis/sentiment/positive

# Get all negative sentiments
GET /api/v1/analysis/sentiment/negative

# Get all neutral sentiments
GET /api/v1/analysis/sentiment/neutral
```

---

### 4. Get Single Record
**GET** `/api/v1/analysis/:id`

Get a specific sentiment record by ID.

**URL Parameters:**
- `id` - MongoDB ObjectId of the sentiment record

**Response:**
```json
{
  "success": true,
  "data": {...sentiment record...}
}
```

---

### 5. Delete Record
**DELETE** `/api/v1/analysis/:id`

Delete a sentiment record.

**Response:**
```json
{
  "success": true,
  "message": "Sentiment record deleted successfully"
}
```

---

### 6. Get Statistics
**GET** `/api/v1/analysis/stats`

Get aggregated statistics for all user's sentiments.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "positive",
      "count": 25,
      "avgScore": 0.87
    },
    {
      "_id": "negative",
      "count": 8,
      "avgScore": 0.32
    },
    {
      "_id": "neutral",
      "count": 9,
      "avgScore": 0.52
    }
  ]
}
```

---

## 🔐 Authentication

All endpoints require JWT authentication. Include the token in:

**Option 1: Bearer Token Header**
```
Authorization: Bearer <your_jwt_token>
```

**Option 2: Cookie** (automatic with browser)
```
accessToken=<your_jwt_token>
```

### Get JWT Token
1. Login with user credentials
2. Extract `accessToken` from response
3. Include in all API requests

---

## 💻 Usage Examples

### JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:8000/api/v1/analysis/sentiment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    videoUrl: 'https://www.youtube.com/watch?v=...',
    label: 'positive',
    score: 0.94
  })
});

const data = await response.json();
console.log(data.data); // Your saved record
```

### Python
```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

payload = {
    'videoUrl': 'https://www.youtube.com/watch?v=...',
    'label': 'positive',
    'score': 0.94
}

response = requests.post(
    'http://localhost:8000/api/v1/analysis/sentiment',
    json=payload,
    headers=headers
)

print(response.json()['data'])
```

### cURL
```bash
# Save sentiment
curl -X POST http://localhost:8000/api/v1/analysis/sentiment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "label": "positive",
    "score": 0.9425275325775146
  }'

# Get all sentiments
curl -X GET "http://localhost:8000/api/v1/analysis" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter positive
curl -X GET "http://localhost:8000/api/v1/analysis/sentiment/positive" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get statistics
curl -X GET "http://localhost:8000/api/v1/analysis/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Database Queries

Your data is stored in MongoDB in the `videossentiments` collection.

### Example Query in MongoDB Compass/CLI
```javascript
// Find all sentiments for a user
db.videosentiments.find({ userId: ObjectId("...") })

// Find positive sentiments
db.videosentiments.find({ sentiment: "positive" })

// Find by score range
db.videosentiments.find({ score: { $gte: 0.8 } })

// Count sentiments by type
db.videosentiments.aggregate([
  { $group: { _id: "$sentiment", count: { $sum: 1 } } }
])

// Average score per sentiment type
db.videosentiments.aggregate([
  { $group: { 
    _id: "$sentiment", 
    avgScore: { $avg: "$score" } 
  }}
])
```

---

## 🚀 Backend Status

- ✅ Backend running on port 8000
- ✅ MongoDB connected and ready
- ✅ Schema created and indexed
- ✅ API endpoints ready
- ✅ Authentication configured

---

## 📁 Files Created/Modified

- `backend/src/models/VideoAnalysis.js` - Schema definition
- `backend/src/services/videoAnalysisService.js` - Business logic
- `backend/src/controllers/videoAnalysisController.js` - API handlers
- `backend/src/routes/analysis.routes.js` - Route definitions
- `backend/src/index.js` - App configuration
- `backend/.env` - Environment variables updated

---

## ✨ Ready to Integrate

Your backend is now ready to receive sentiment analysis from your ML model!

**Next Steps:**
1. Get JWT token after user login
2. Call `POST /api/v1/analysis/sentiment` with your ML output
3. Query results with filter endpoints
4. Display in frontend

Start sending your ML model outputs now! 🚀

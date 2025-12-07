# ML Model → Backend Integration Guide

## Your ML Model Output Format
```python
output = [
    {'label': 'positive', 'score': 0.9425275325775146},
    {'label': 'negative', 'score': 0.0423945234},
    {'label': 'neutral', 'score': 0.0150779422}
]
```

## How to Send to Backend

### Step 1: Extract Top Sentiment
```python
top_sentiment = max(output, key=lambda x: x['score'])
# Result: {'label': 'positive', 'score': 0.9425275325775146}
```

### Step 2: Send HTTP POST Request
```python
import requests

url = "http://localhost:8000/api/v1/analysis/sentiment"

headers = {
    "Authorization": f"Bearer {user_token}",  # Get from login
    "Content-Type": "application/json"
}

data = {
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  # Original video URL
    "label": top_sentiment['label'],  # 'positive', 'negative', or 'neutral'
    "score": top_sentiment['score']   # 0.9425275325775146
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

### Step 3: Response

**Success (201 Created):**
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
    "updatedAt": "2025-12-07T18:18:06.721Z"
  }
}
```

## Database Schema

```javascript
VideoSentiment {
  _id: ObjectId,                    // MongoDB auto ID
  userId: ObjectId,                 // From JWT token
  videoUrl: String,                 // Video URL you send
  videoId: String,                  // Extracted from URL
  sentiment: String,                // Your top label (lowercase)
  score: Number,                    // Your top score (0-1)
  createdAt: Date,                  // Auto timestamp
  updatedAt: Date                   // Auto timestamp
}
```

## Complete Python Integration Example

```python
import requests
from typing import List, Dict, Tuple

class SentimentBackend:
    def __init__(self, backend_url: str = "http://localhost:8000"):
        self.backend_url = backend_url
        self.user_token = None
    
    def login(self, email: str, password: str) -> bool:
        """Login and get JWT token"""
        url = f"{self.backend_url}/api/v1/users/login"
        response = requests.post(url, json={
            "email": email,
            "password": password
        })
        if response.status_code == 200:
            # Token is in cookies, extract manually or use session
            self.user_token = response.cookies.get('accessToken')
            return True
        return False
    
    def extract_top_sentiment(self, ml_output: List[Dict]) -> Tuple[str, float]:
        """Extract top sentiment from ML model output"""
        top = max(ml_output, key=lambda x: x['score'])
        return top['label'], top['score']
    
    def save_sentiment(self, video_url: str, ml_output: List[Dict]) -> Dict:
        """
        Save sentiment analysis result to backend
        
        Args:
            video_url: YouTube video URL
            ml_output: ML model output list of dicts with 'label' and 'score'
        
        Returns:
            Saved sentiment record or error dict
        """
        url = f"{self.backend_url}/api/v1/analysis/sentiment"
        
        # Extract top sentiment
        label, score = self.extract_top_sentiment(ml_output)
        
        headers = {
            "Authorization": f"Bearer {self.user_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "videoUrl": video_url,
            "label": label,
            "score": score
        }
        
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 201:
            return response.json()['data']
        else:
            return {"error": response.json()}
    
    def get_all_sentiments(self, limit: int = 20, skip: int = 0) -> List[Dict]:
        """Get all user sentiments"""
        url = f"{self.backend_url}/api/v1/analysis?limit={limit}&skip={skip}"
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            return response.json()['data']
        return []
    
    def filter_by_sentiment(self, sentiment_type: str) -> List[Dict]:
        """Filter sentiments by type"""
        url = f"{self.backend_url}/api/v1/analysis/sentiment/{sentiment_type}"
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            return response.json()['data']
        return []

# Usage Example
if __name__ == "__main__":
    backend = SentimentBackend()
    
    # 1. Login
    # backend.login("user@example.com", "password")
    
    # 2. Simulate ML model output
    ml_output = [
        {'label': 'positive', 'score': 0.9425275325775146},
        {'label': 'negative', 'score': 0.0423945234},
        {'label': 'neutral', 'score': 0.0150779422}
    ]
    
    # 3. Save sentiment
    # result = backend.save_sentiment(
    #     "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    #     ml_output
    # )
    # print("Saved:", result)
    
    # 4. Get all sentiments
    # all_sentiments = backend.get_all_sentiments()
    # print(f"Total: {len(all_sentiments)}")
    
    # 5. Filter by type
    # positive = backend.filter_by_sentiment('positive')
    # print(f"Positive: {len(positive)}")
```

## cURL Commands

### Save Sentiment
```bash
curl -X POST http://localhost:8000/api/v1/analysis/sentiment \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "label": "positive",
    "score": 0.9425275325775146
  }'
```

### Get All Sentiments
```bash
curl -X GET "http://localhost:8000/api/v1/analysis" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Filter by Sentiment Type
```bash
curl -X GET "http://localhost:8000/api/v1/analysis/sentiment/positive" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Statistics
```bash
curl -X GET "http://localhost:8000/api/v1/analysis/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## JavaScript/Node.js Example

```javascript
class SentimentAPI {
  constructor(baseURL = "http://localhost:8000") {
    this.baseURL = baseURL;
    this.token = null;
  }
  
  async saveSentiment(videoUrl, label, score) {
    const response = await fetch(`${this.baseURL}/api/v1/analysis/sentiment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        videoUrl,
        label,
        score
      })
    });
    
    return response.json();
  }
  
  async getSentiments() {
    const response = await fetch(`${this.baseURL}/api/v1/analysis`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    
    return response.json();
  }
  
  async filterBySentiment(type) {
    const response = await fetch(`${this.baseURL}/api/v1/analysis/sentiment/${type}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    
    return response.json();
  }
}

// Usage
const api = new SentimentAPI();
// api.token = 'YOUR_JWT_TOKEN';
// const result = await api.saveSentiment(url, 'positive', 0.9425);
```

## Error Handling

### 401 Unauthorized
- JWT token is missing or invalid
- Need to login first
- Token might have expired

### 400 Bad Request
- Missing required fields
- Invalid sentiment label (must be lowercase)
- Score not between 0 and 1

### 500 Server Error
- Database connection issue
- Server error occurred

## Testing Without Authentication

For local testing, you can temporarily bypass authentication or create a test user account. Ask to enable public test mode if needed.

## Important Notes

1. **Label Format**: Must be lowercase - 'positive', 'negative', 'neutral'
2. **Score Range**: Must be between 0.0 and 1.0
3. **Authentication**: All endpoints require JWT token (except login/signup)
4. **Video URL**: Store the original URL provided by user
5. **VideoID**: Automatically extracted from YouTube URLs

## Data Will Be Stored As

When you call the endpoint with:
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "label": "positive",
  "score": 0.9425275325775146
}
```

MongoDB stores:
```javascript
{
  userId: "from_jwt_token",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  videoId: "dQw4w9WgXcQ",  // Auto-extracted
  sentiment: "positive",    // Auto-lowercased
  score: 0.9425275325775146,
  createdAt: "2025-12-07T18:18:06.721Z",
  updatedAt: "2025-12-07T18:18:06.721Z"
}
```

Ready to integrate! 🚀

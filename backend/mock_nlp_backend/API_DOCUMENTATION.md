# Sentiment Analyzer Backend API

A heuristic-based sentiment analyzer with adaptive learning capabilities that accepts JSON file uploads for batch analysis of YouTube comments.

## Features

- **Single Comment Analysis**: Analyze individual comments via web UI or API
- **Batch File Upload**: Upload JSON files with multiple comments for batch analysis
- **Adaptive Learning**: Model learns from user feedback to improve accuracy
- **Real-time Training**: Continuously improves predictions based on feedback
- **Model Persistence**: Learning state saved across server restarts

## API Endpoints

### 1. Analyze Single Comment
**POST** `/api/analyze`

Analyze a single comment and get sentiment prediction.

**Request Body:**
```json
{
  "comment": "This video is amazing!"
}
```

**Response:**
```json
{
  "success": true,
  "sentiment": "Positive",
  "score": 3.5,
  "confidence": 0.85,
  "details": ["Found positive words: amazing, video"],
  "modelAccuracy": "84.4%"
}
```

### 2. Analyze JSON File (Batch)
**POST** `/api/analyze-file`

Upload a JSON file containing multiple comments for batch analysis.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `jsonFile`: JSON file containing comments

**Supported JSON Formats:**

**Format 1: With "comments" key**
```json
{
  "comments": [
    {
      "id": 1,
      "text": "This video is absolutely amazing!"
    },
    {
      "id": 2,
      "text": "Terrible content, waste of time"
    }
  ]
}
```

**Format 2: Direct array**
```json
[
  {
    "id": 1,
    "text": "Great tutorial!"
  },
  {
    "text": "Not impressed"
  }
]
```

**Format 3: Simple text array**
```json
[
  "This is awesome!",
  "I don't like this",
  "It's okay"
]
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalComments": 5,
    "positive": 2,
    "negative": 2,
    "neutral": 1,
    "averageConfidence": "0.782"
  },
  "results": [
    {
      "id": 1,
      "text": "This video is absolutely amazing!",
      "sentiment": "Positive",
      "score": 4.5,
      "confidence": 0.92,
      "details": ["Found positive words: amazing, video"]
    },
    {
      "id": 2,
      "text": "Terrible content, waste of time",
      "sentiment": "Negative",
      "score": -3.2,
      "confidence": 0.88,
      "details": ["Found negative words: terrible, waste"]
    }
  ]
}
```

### 3. Provide Feedback
**POST** `/api/feedback`

Provide feedback to train the model with correct sentiment labels.

**Request Body:**
```json
{
  "comment": "Not bad at all",
  "actualSentiment": "Positive"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback recorded. Model updated!",
  "newAccuracy": "85.2%"
}
```

### 4. Get Model Statistics
**GET** `/api/model-stats`

Retrieve current model performance statistics.

**Response:**
```json
{
  "success": true,
  "accuracy": "84.4%",
  "totalFeedback": 45,
  "learnedWords": 8,
  "correctPredictions": 38
}
```

### 5. Reset Learning Model
**POST** `/api/reset-model`

Reset the learning model to initial state.

**Response:**
```json
{
  "success": true,
  "message": "Learning model has been reset"
}
```

## Usage Examples

### Using cURL

**Analyze Single Comment:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"comment": "This tutorial is fantastic!"}'
```

**Upload JSON File:**
```bash
curl -X POST http://localhost:3000/api/analyze-file \
  -F "jsonFile=@comments.json"
```

**Provide Feedback:**
```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"comment": "Not bad", "actualSentiment": "Positive"}'
```

### Using JavaScript (Fetch API)

**Analyze Single Comment:**
```javascript
const response = await fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ comment: 'Amazing video!' })
});
const data = await response.json();
console.log(data);
```

**Upload JSON File:**
```javascript
const formData = new FormData();
formData.append('jsonFile', fileInput.files[0]);

const response = await fetch('http://localhost:3000/api/analyze-file', {
  method: 'POST',
  body: formData
});
const data = await response.json();
console.log(data);
```

### Using Python

**Analyze Single Comment:**
```python
import requests

response = requests.post('http://localhost:3000/api/analyze', 
  json={'comment': 'Great content!'})
print(response.json())
```

**Upload JSON File:**
```python
import requests

with open('comments.json', 'rb') as f:
  files = {'jsonFile': f}
  response = requests.post('http://localhost:3000/api/analyze-file', files=files)
  print(response.json())
```

## Installation & Setup

1. **Install Dependencies:**
```bash
npm install
```

2. **Start Server:**
```bash
npm start
```

3. **Access Web UI:**
Open browser to `http://localhost:3000`

4. **Train Model (Optional):**
```bash
npm run train
```

## File Upload Limits

- Maximum file size: **10MB**
- Accepted file types: `.json` files only
- Maximum comments per file: Unlimited (practical limit based on memory)

## Error Responses

**Invalid JSON:**
```json
{
  "error": "Invalid JSON file format"
}
```

**Missing Comments:**
```json
{
  "error": "JSON file must contain a 'comments' array or be an array of comment objects"
}
```

**File Too Large:**
```json
{
  "error": "File too large. Maximum size is 10MB"
}
```

**Invalid File Type:**
```json
{
  "error": "Only JSON files are allowed"
}
```

## Web Interface

The application includes a web interface accessible at `http://localhost:3000` with features:

- Single comment analysis
- JSON file upload with drag-and-drop
- Visual sentiment results with emoji indicators
- Summary statistics (positive/negative/neutral counts)
- Detailed results table with confidence scores
- Feedback mechanism to train the model
- Model performance dashboard
- Download results as JSON

## Technologies Used

- **Backend**: Node.js, Express.js
- **File Upload**: Multer
- **Sentiment Analysis**: Custom heuristic algorithm
- **Learning**: Adaptive weight adjustment with feedback loop
- **Storage**: JSON file persistence

## Model Details

The sentiment analyzer uses:
- Lexicon-based word scoring
- Negation detection (3-word lookback)
- Intensifier recognition (very, really, extremely)
- Emoji sentiment analysis
- Adaptive learning from user feedback
- Dynamic threshold adjustment

## License

MIT

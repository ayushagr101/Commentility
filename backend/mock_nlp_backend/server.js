const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { analyze: analyzeAdaptive, provideFeedback, getModelStats, resetModel, loadLearningModel } = require('./adaptiveAnalyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// Load the learning model on startup
loadLearningModel();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'));
    }
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for adaptive sentiment analysis (always use learning mode)
app.post('/api/analyze', (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || typeof comment !== 'string') {
      return res.status(400).json({ error: 'comment is required and must be a string' });
    }
    const result = analyzeAdaptive(comment);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Keep adaptive endpoint for backward compatibility
app.post('/api/analyze-adaptive', (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || typeof comment !== 'string') {
      return res.status(400).json({ error: 'comment is required and must be a string' });
    }
    const result = analyzeAdaptive(comment);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for providing feedback to train the model
app.post('/api/feedback', (req, res) => {
  try {
    const { comment, actualSentiment } = req.body;
    if (!comment || !actualSentiment) {
      return res.status(400).json({ error: 'comment and actualSentiment are required' });
    }
    if (!['Positive', 'Negative', 'Neutral'].includes(actualSentiment)) {
      return res.status(400).json({ error: 'actualSentiment must be Positive, Negative, or Neutral' });
    }
    const result = provideFeedback(comment, actualSentiment);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for model statistics
app.get('/api/model-stats', (req, res) => {
  try {
    const stats = getModelStats();
    res.json({ success: true, ...stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to reset the learning model
app.post('/api/reset-model', (req, res) => {
  try {
    const result = resetModel();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for analyzing comments from uploaded JSON file
app.post('/api/analyze-file', upload.single('jsonFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a JSON file.' });
    }

    // Read the uploaded file
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    let jsonData;

    try {
      jsonData = JSON.parse(fileContent);
    } catch (parseErr) {
      // Clean up the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid JSON file format' });
    }

    // Extract comments array from JSON
    let comments = [];
    if (Array.isArray(jsonData)) {
      comments = jsonData;
    } else if (jsonData.comments && Array.isArray(jsonData.comments)) {
      comments = jsonData.comments;
    } else {
      // Clean up the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: 'JSON file must contain a "comments" array or be an array of comment objects' 
      });
    }

    // Analyze each comment
    const results = comments.map((comment, index) => {
      const text = typeof comment === 'string' ? comment : (comment.text || comment.comment || '');
      if (!text) {
        return {
          id: comment.id || index + 1,
          text: '',
          error: 'Empty comment text'
        };
      }
      const analysis = analyzeAdaptive(text);
      return {
        id: comment.id || index + 1,
        text: text,
        ...analysis
      };
    });

    // Calculate summary statistics
    const summary = {
      totalComments: results.length,
      positive: results.filter(r => r.sentiment === 'Positive').length,
      negative: results.filter(r => r.sentiment === 'Negative').length,
      neutral: results.filter(r => r.sentiment === 'Neutral').length,
      averageConfidence: (results.reduce((sum, r) => sum + (r.confidence || 0), 0) / results.length).toFixed(3)
    };

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      summary: summary,
      results: results
    });

  } catch (err) {
    console.error(err);
    // Clean up the uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Sentiment Analyzer server running on http://localhost:${PORT}`);
  console.log(`Adaptive Learning Mode: Enabled`);
});

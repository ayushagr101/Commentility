let analysisCount = { positive: 0, negative: 0, neutral: 0 };
let lastComment = null;
let lastPrediction = null;
let fileAnalysisResults = null;

const commentInput = document.getElementById('commentInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultContainer = document.getElementById('resultContainer');
const errorContainer = document.getElementById('errorContainer');
const resetBtn = document.getElementById('resetBtn');
const feedbackSection = document.getElementById('feedbackSection');
const feedbackOptions = document.getElementById('feedbackOptions');
const feedbackMessage = document.getElementById('feedbackMessage');
const resetModelBtn = document.getElementById('resetModelBtn');

// File upload elements
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const uploadBtn = document.getElementById('uploadBtn');
const fileResultsContainer = document.getElementById('fileResultsContainer');
const closeFileResults = document.getElementById('closeFileResults');
const downloadResults = document.getElementById('downloadResults');

// Load model stats on page load
window.addEventListener('DOMContentLoaded', () => {
  loadModelStats();
});

// Analyze button click handler (always uses adaptive learning)
analyzeBtn.addEventListener('click', async () => {
  const comment = commentInput.value.trim();

  if (!comment) {
    showError('Please enter a comment to analyze');
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing...';
  errorContainer.classList.add('hidden');
  feedbackSection.classList.add('hidden');
  feedbackOptions.classList.add('hidden');
  feedbackMessage.classList.add('hidden');

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze comment');
    }

    const data = await response.json();
    lastComment = comment;
    lastPrediction = data;
    displayResult(data, comment);
    updateStats(data.sentiment);
    feedbackSection.classList.remove('hidden');
  } catch (error) {
    showError(error.message || 'An error occurred while analyzing');
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze Sentiment';
  }
});

// Enter key to analyze
commentInput.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    analyzeBtn.click();
  }
});

// Display analysis result
function displayResult(data, comment) {
  const { sentiment, score, confidence, details, modelAccuracy } = data;

  // Update sentiment badge and label
  const sentimentBadge = document.getElementById('sentimentBadge');
  const sentimentLabel = document.getElementById('sentimentLabel');

  sentimentBadge.className = 'sentiment-badge ' + sentiment.toLowerCase();
  sentimentBadge.textContent = getSentimentEmoji(sentiment);
  sentimentLabel.textContent = sentiment;

  // Update confidence and score
  document.getElementById('confidenceText').textContent = `Confidence: ${(confidence * 100).toFixed(1)}%`;
  document.getElementById('scoreText').textContent = `Score: ${score}`;

  // Show model accuracy in learning mode
  if (modelAccuracy) {
    const modelAccuracyText = document.getElementById('modelAccuracyText');
    modelAccuracyText.textContent = `Model Accuracy: ${modelAccuracy}`;
    modelAccuracyText.classList.remove('hidden');
  }

  // Update details list
  const detailsList = document.getElementById('detailsList');
  detailsList.innerHTML = '';
  if (Array.isArray(details) && details.length > 0) {
    details.forEach((detail) => {
      const item = document.createElement('div');
      item.className = 'detail-item';
      item.textContent = detail;
      detailsList.appendChild(item);
    });
  } else {
    detailsList.innerHTML = '<div class="detail-item">No specific details available</div>';
  }

  // Update comment echo
  document.getElementById('commentEcho').textContent = comment;

  // Show result container
  resultContainer.classList.remove('hidden');
  resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show error message
function showError(message) {
  errorContainer.classList.remove('hidden');
  document.getElementById('errorMessage').textContent = message;
}

// Get emoji for sentiment
function getSentimentEmoji(sentiment) {
  const emojis = {
    positive: '😊',
    negative: '😞',
    neutral: '😐'
  };
  return emojis[sentiment.toLowerCase()] || '🤔';
}

// Update statistics
function updateStats(sentiment) {
  const key = sentiment.toLowerCase();
  if (key in analysisCount) {
    analysisCount[key]++;
  }

  document.getElementById('positiveCount').textContent = analysisCount.positive;
  document.getElementById('negativeCount').textContent = analysisCount.negative;
  document.getElementById('neutralCount').textContent = analysisCount.neutral;
}

// Reset statistics
resetBtn.addEventListener('click', () => {
  analysisCount = { positive: 0, negative: 0, neutral: 0 };
  document.getElementById('positiveCount').textContent = '0';
  document.getElementById('negativeCount').textContent = '0';
  document.getElementById('neutralCount').textContent = '0';
  commentInput.value = '';
  resultContainer.classList.add('hidden');
  errorContainer.classList.add('hidden');
});

// Feedback: Mark as correct
document.querySelector('.correct-btn').addEventListener('click', async () => {
  if (lastPrediction) {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment: lastComment,
        actualSentiment: lastPrediction.sentiment
      })
    });

    const result = await response.json();
    showFeedbackMessage(result.message, 'success');
    loadModelStats();
  }
});

// Feedback: Mark as incorrect
document.querySelector('.incorrect-btn').addEventListener('click', () => {
  feedbackOptions.classList.remove('hidden');
});

// Feedback: Select correct sentiment
document.querySelectorAll('.sentiment-select-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const correctSentiment = e.target.dataset.sentiment;
    
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment: lastComment,
        actualSentiment: correctSentiment
      })
    });

    const result = await response.json();
    showFeedbackMessage(`Feedback recorded! Model updated. ${result.message}`, 'success');
    feedbackOptions.classList.add('hidden');
    loadModelStats();
  });
});

// Show feedback message
function showFeedbackMessage(msg, type) {
  feedbackMessage.textContent = msg;
  feedbackMessage.className = `feedback-message ${type}`;
  feedbackMessage.classList.remove('hidden');
  setTimeout(() => {
    feedbackMessage.classList.add('hidden');
  }, 3000);
}

// Load and display model statistics
async function loadModelStats() {
  try {
    const response = await fetch('/api/model-stats');
    const stats = await response.json();

    document.getElementById('modelAccuracy').textContent = stats.accuracy;
    document.getElementById('feedbackCount').textContent = stats.totalFeedback;
    document.getElementById('learnedWords').textContent = stats.learnedWords || 0;
  } catch (err) {
    console.error('Error loading model stats:', err);
  }
}

// Reset learning model
resetModelBtn.addEventListener('click', async () => {
  if (confirm('Are you sure? This will reset all learned data.')) {
    const response = await fetch('/api/reset-model', { method: 'POST' });
    const result = await response.json();
    showFeedbackMessage(result.message, 'success');
    loadModelStats();
  }
});

// File upload handling
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    fileName.textContent = file.name;
    uploadBtn.disabled = false;
  } else {
    fileName.textContent = 'No file chosen';
    uploadBtn.disabled = true;
  }
});

// Upload and analyze file
uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    showError('Please select a JSON file');
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.textContent = 'Analyzing...';
  errorContainer.classList.add('hidden');

  try {
    const formData = new FormData();
    formData.append('jsonFile', file);

    const response = await fetch('/api/analyze-file', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze file');
    }

    const data = await response.json();
    fileAnalysisResults = data;
    displayFileResults(data);
  } catch (error) {
    showError(error.message || 'An error occurred while analyzing the file');
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = 'Analyze File';
  }
});

// Display file analysis results
function displayFileResults(data) {
  const { summary, results } = data;

  // Update summary stats
  document.getElementById('summaryTotal').textContent = summary.totalComments;
  document.getElementById('summaryPositive').textContent = summary.positive;
  document.getElementById('summaryNegative').textContent = summary.negative;
  document.getElementById('summaryNeutral').textContent = summary.neutral;
  document.getElementById('summaryConfidence').textContent = (parseFloat(summary.averageConfidence) * 100).toFixed(1) + '%';

  // Display detailed results
  const resultsList = document.getElementById('fileResultsList');
  resultsList.innerHTML = '';

  results.forEach(result => {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';

    if (result.error) {
      resultItem.innerHTML = `
        <div class="result-item-header">
          <span class="result-id">Comment #${result.id}</span>
          <span class="result-sentiment negative">Error</span>
        </div>
        <div class="result-text">${result.error}</div>
      `;
    } else {
      resultItem.innerHTML = `
        <div class="result-item-header">
          <span class="result-id">Comment #${result.id}</span>
          <span class="result-sentiment ${result.sentiment.toLowerCase()}">${getSentimentEmoji(result.sentiment)} ${result.sentiment}</span>
        </div>
        <div class="result-text">${result.text}</div>
        <div class="result-metrics">
          <span>📊 Score: ${result.score}</span>
          <span>✓ Confidence: ${(result.confidence * 100).toFixed(1)}%</span>
        </div>
      `;
    }

    resultsList.appendChild(resultItem);
  });

  // Show file results container and scroll to it
  fileResultsContainer.classList.remove('hidden');
  fileResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Close file results
closeFileResults.addEventListener('click', () => {
  fileResultsContainer.classList.add('hidden');
});

// Download results as JSON
downloadResults.addEventListener('click', () => {
  if (!fileAnalysisResults) return;

  const dataStr = JSON.stringify(fileAnalysisResults, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `sentiment-analysis-results-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});


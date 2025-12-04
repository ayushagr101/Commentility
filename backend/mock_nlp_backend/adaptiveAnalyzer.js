/**
 * Adaptive Sentiment Analyzer with Learning Capability
 * Learns from user feedback and adjusts word weights and thresholds
 */

const fs = require('fs');
const path = require('path');

// Default sentiment lexicon
let POSITIVE_WORDS = {
  love: 2, great: 1.5, awesome: 2, fantastic: 2, good: 1, excellent: 2,
  amazing: 2, wonderful: 2, best: 2, perfect: 2, nice: 1, beautiful: 1.5,
  brilliant: 2, superb: 2, outstanding: 2, terrific: 1.5,
  like: 0.8, enjoy: 1.5, thank: 0.5, grateful: 1.5, thanks: 0.5, happy: 1.5, pleased: 1,
  impressed: 1.5, helpful: 1, funny: 1, entertaining: 1.5,
  cool: 1, rock: 1.5, legend: 1.5, hero: 1.5, brilliant: 2,
  appreciate: 1, appreciated: 1, quality: 0.8, great: 1.5,
  well: 0.5, smooth: 0.5, clear: 0.5, informative: 1, easy: 0.8, exactly: 0.5
};

let NEGATIVE_WORDS = {
  hate: -2, terrible: -2, awful: -2, bad: -1, worst: -2, dislike: -1.5,
  boring: -1, stupid: -2, dumb: -2, pathetic: -2, disgusting: -2,
  poor: -1, weak: -1, fail: -1.5, annoying: -1.5, frustrating: -1.5,
  useless: -2, garbage: -2, trash: -2, sucks: -2, crap: -2,
  disappointed: -1.5, disappointing: -1.5, sad: -1, angry: -1.5, mad: -1.5, waste: -1.5,
  confusing: -1, confused: -1, unclear: -1, hard: -0.5, difficult: -0.5,
  wrong: -1, incomplete: -1, missing: -0.5, meh: -0.5
};

let INTENSIFIERS = ['very', 'extremely', 'so', 'really', 'absolutely', 'incredibly', 'super', 'totally', 'seriously', 'truly'];
let NEGATIONS = ['not', 'no', 'never', "don't", "doesn't", "didn't", "can't", "couldn't", "won't", "wouldn't", "isn't", "aren't", "wasn't", "weren't"];

const EMOJI_MAP = {
  '😀': 1.5, '😃': 1.5, '😄': 1.5, '😁': 1.5, '😆': 1.5, '😍': 2, '🥰': 2, '😘': 1.5,
  '😂': 1.5, '🤣': 1.5, '😊': 1, '😌': 0.8, '🙂': 0.5,
  '😐': 0, '😑': 0, '😠': -1.5, '😡': -2, '😤': -1.5, '😢': -1.5, '😭': -2,
  '🤮': -2, '😱': -1, '😰': -1.5, '💔': -2, '👎': -1, '👍': 1
};

// Learning state
let learningModel = {
  wordWeights: {},
  sentimentThresholds: { positive: 0.5, negative: -0.5 },
  feedbackHistory: [],
  accuracyMetrics: { correct: 0, total: 0 }
};

const LEARNING_FILE = path.join(__dirname, 'learningModel.json');
const FEEDBACK_LOG = path.join(__dirname, 'feedbackLog.json');

/**
 * Load learning model from disk
 */
function loadLearningModel() {
  try {
    if (fs.existsSync(LEARNING_FILE)) {
      learningModel = JSON.parse(fs.readFileSync(LEARNING_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Could not load learning model, using defaults:', err.message);
  }
}

/**
 * Save learning model to disk
 */
function saveLearningModel() {
  try {
    fs.writeFileSync(LEARNING_FILE, JSON.stringify(learningModel, null, 2));
  } catch (err) {
    console.error('Error saving learning model:', err.message);
  }
}

/**
 * Log feedback for analysis
 */
function logFeedback(feedback) {
  try {
    let logs = [];
    if (fs.existsSync(FEEDBACK_LOG)) {
      logs = JSON.parse(fs.readFileSync(FEEDBACK_LOG, 'utf8'));
    }
    logs.push({ ...feedback, timestamp: new Date().toISOString() });
    fs.writeFileSync(FEEDBACK_LOG, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error('Error logging feedback:', err.message);
  }
}

/**
 * Update word weights based on feedback
 */
function updateWordWeights(comment, predictedSentiment, actualSentiment, tokens) {
  if (predictedSentiment === actualSentiment) return; // No update needed if correct

  const learningRate = 0.1;
  const adjustment = predictedSentiment === 'Positive' ? -learningRate : learningRate;

  // Adjust weights for words that contributed to the error
  tokens.forEach(word => {
    if (word in POSITIVE_WORDS || word in NEGATIVE_WORDS) {
      if (!learningModel.wordWeights[word]) {
        learningModel.wordWeights[word] = word in POSITIVE_WORDS ? POSITIVE_WORDS[word] : NEGATIVE_WORDS[word];
      }
      learningModel.wordWeights[word] += adjustment;
      
      // Apply updated weight
      if (word in POSITIVE_WORDS) {
        POSITIVE_WORDS[word] = learningModel.wordWeights[word];
      } else if (word in NEGATIVE_WORDS) {
        NEGATIVE_WORDS[word] = learningModel.wordWeights[word];
      }
    }
  });
}

/**
 * Update sentiment thresholds based on feedback
 */
function updateThresholds(score, predictedSentiment, actualSentiment) {
  if (predictedSentiment === actualSentiment) return;

  const adjustment = 0.05;

  if (actualSentiment === 'Positive' && predictedSentiment === 'Neutral') {
    learningModel.sentimentThresholds.positive -= adjustment;
  } else if (actualSentiment === 'Positive' && predictedSentiment === 'Negative') {
    learningModel.sentimentThresholds.positive -= adjustment * 2;
  } else if (actualSentiment === 'Negative' && predictedSentiment === 'Neutral') {
    learningModel.sentimentThresholds.negative += adjustment;
  } else if (actualSentiment === 'Negative' && predictedSentiment === 'Positive') {
    learningModel.sentimentThresholds.negative += adjustment * 2;
  }
}

/**
 * Tokenize comment
 */
function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^\w\s\u0100-\uFFFF]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

/**
 * Analyze emojis
 */
function analyzeEmojis(text) {
  let emojiScore = 0;
  for (const [emoji, score] of Object.entries(EMOJI_MAP)) {
    const count = (text.match(new RegExp(emoji, 'g')) || []).length;
    emojiScore += count * score;
  }
  return emojiScore;
}

/**
 * Main analysis function with learning capability
 */
function analyze(comment) {
  if (!comment || typeof comment !== 'string') {
    return { sentiment: 'Neutral', score: 0, confidence: 0, details: [], modelAccuracy: '0%' };
  }

  const tokens = tokenize(comment);
  let totalScore = 0;
  const details = [];

  // Analyze emojis
  const emojiScore = analyzeEmojis(comment);
  if (emojiScore !== 0) {
    totalScore += emojiScore;
    details.push(`Emojis: ${emojiScore > 0 ? '+' : ''}${emojiScore.toFixed(2)}`);
  }

  // Analyze words with learned weights
  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    let wordScore = 0;

    // Check learned weights first, then default lexicon
    if (learningModel.wordWeights[word]) {
      wordScore = learningModel.wordWeights[word];
    } else if (word in POSITIVE_WORDS) {
      wordScore = POSITIVE_WORDS[word];
    } else if (word in NEGATIVE_WORDS) {
      wordScore = NEGATIVE_WORDS[word];
    }

    if (wordScore !== 0) {
      let isNegated = false;
      for (let j = Math.max(0, i - 3); j < i; j++) {
        if (NEGATIONS.includes(tokens[j])) {
          isNegated = true;
          break;
        }
      }

      let isIntensified = false;
      if (i > 0 && INTENSIFIERS.includes(tokens[i - 1])) {
        isIntensified = true;
      }

      if (isNegated) {
        wordScore *= -1;
      }

      if (isIntensified) {
        wordScore *= 1.5;
        const intensifier = tokens[i - 1];
        const negationInfo = isNegated ? ' (negated)' : '';
        details.push(`${intensifier.charAt(0).toUpperCase() + intensifier.slice(1)} "${word}"${negationInfo}: ${wordScore.toFixed(2)}`);
      } else if (wordScore !== 0) {
        const negationInfo = isNegated ? ' (negated)' : '';
        details.push(`"${word}"${negationInfo}: ${wordScore.toFixed(2)}`);
      }

      totalScore += wordScore;
    }
  }

  // Adjust for punctuation
  const exclamationCount = (comment.match(/!/g) || []).length;
  totalScore += exclamationCount * 0.3;
  if (exclamationCount > 0) details.push(`Exclamations (+${(exclamationCount * 0.3).toFixed(2)})`);

  // Use learned thresholds
  const positiveThreshold = learningModel.sentimentThresholds.positive;
  const negativeThreshold = learningModel.sentimentThresholds.negative;

  let sentiment = 'Neutral';
  let confidence = 0;

  if (totalScore > positiveThreshold) {
    sentiment = 'Positive';
    confidence = Math.min(1, Math.abs(totalScore) / 5);
  } else if (totalScore < negativeThreshold) {
    sentiment = 'Negative';
    confidence = Math.min(1, Math.abs(totalScore) / 5);
  } else {
    sentiment = 'Neutral';
    confidence = 1 - Math.abs(totalScore) / 2;
  }

  const modelAccuracy = learningModel.accuracyMetrics.total > 0 
    ? `${(learningModel.accuracyMetrics.correct / learningModel.accuracyMetrics.total * 100).toFixed(1)}%`
    : 'N/A';

  return {
    sentiment,
    score: parseFloat(totalScore.toFixed(2)),
    confidence: parseFloat(confidence.toFixed(2)),
    details: details.slice(0, 10),
    modelAccuracy,
    learningMode: true
  };
}

/**
 * Provide feedback to train the model
 */
function provideFeedback(comment, actualSentiment) {
  const prediction = analyze(comment);
  const tokens = tokenize(comment);

  // Update metrics
  if (prediction.sentiment === actualSentiment) {
    learningModel.accuracyMetrics.correct++;
  }
  learningModel.accuracyMetrics.total++;

  // Update word weights and thresholds
  updateWordWeights(comment, prediction.sentiment, actualSentiment, tokens);
  updateThresholds(prediction.score, prediction.sentiment, actualSentiment);

  // Save updated model
  saveLearningModel();

  // Log the feedback
  logFeedback({
    comment,
    predicted: prediction.sentiment,
    actual: actualSentiment,
    score: prediction.score,
    correct: prediction.sentiment === actualSentiment
  });

  return {
    success: true,
    message: `Feedback recorded. Model accuracy: ${(learningModel.accuracyMetrics.correct / learningModel.accuracyMetrics.total * 100).toFixed(1)}%`,
    metrics: learningModel.accuracyMetrics
  };
}

/**
 * Get model statistics
 */
function getModelStats() {
  return {
    accuracy: learningModel.accuracyMetrics.total > 0 
      ? `${(learningModel.accuracyMetrics.correct / learningModel.accuracyMetrics.total * 100).toFixed(1)}%`
      : 'No feedback yet',
    totalFeedback: learningModel.accuracyMetrics.total,
    correctPredictions: learningModel.accuracyMetrics.correct,
    thresholds: learningModel.sentimentThresholds,
    learnedWords: Object.keys(learningModel.wordWeights).length
  };
}

/**
 * Reset learning model
 */
function resetModel() {
  learningModel = {
    wordWeights: {},
    sentimentThresholds: { positive: 0.5, negative: -0.5 },
    feedbackHistory: [],
    accuracyMetrics: { correct: 0, total: 0 }
  };
  saveLearningModel();
  return { success: true, message: 'Learning model reset to defaults' };
}

// Load model on startup
loadLearningModel();

module.exports = { analyze, provideFeedback, getModelStats, resetModel, loadLearningModel, saveLearningModel };

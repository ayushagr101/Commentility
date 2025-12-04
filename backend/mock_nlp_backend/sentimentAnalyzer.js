/**
 * Heuristic-based sentiment analyzer for YouTube comments
 */

// Sentiment lexicon with word scores
const POSITIVE_WORDS = {
  love: 2, great: 1.5, awesome: 2, fantastic: 2, good: 1, excellent: 2,
  amazing: 2, wonderful: 2, best: 2, perfect: 2, nice: 1, beautiful: 1.5,
  brilliant: 2, superb: 2, outstanding: 2, terrific: 1.5,
  like: 0.8, enjoy: 1.5, thank: 0.5, grateful: 1.5, thanks: 0.5, happy: 1.5, pleased: 1,
  impressed: 1.5, helpful: 1, funny: 1, entertaining: 1.5,
  cool: 1, rock: 1.5, legend: 1.5, hero: 1.5, brilliant: 2,
  appreciate: 1, appreciated: 1, appreciate: 1, quality: 0.8, great: 1.5,
  well: 0.5, smooth: 0.5, clear: 0.5, informative: 1, easy: 0.8, exactly: 0.5
};

const NEGATIVE_WORDS = {
  hate: -2, terrible: -2, awful: -2, bad: -1, worst: -2, dislike: -1.5,
  boring: -1, stupid: -2, dumb: -2, pathetic: -2, disgusting: -2,
  poor: -1, weak: -1, fail: -1.5, annoying: -1.5, frustrating: -1.5,
  useless: -2, garbage: -2, trash: -2, sucks: -2, crap: -2,
  disappointed: -1.5, disappointing: -1.5, sad: -1, angry: -1.5, mad: -1.5, waste: -1.5,
  confusing: -1, confused: -1, unclear: -1, hard: -0.5, difficult: -0.5,
  wrong: -1, incomplete: -1, missing: -0.5, meh: -0.5
};

// Words that intensify the following word
const INTENSIFIERS = ['very', 'extremely', 'so', 'really', 'absolutely', 'incredibly', 'super', 'totally', 'seriously', 'truly'];

// Negation words that flip sentiment
const NEGATIONS = ['not', 'no', 'never', "don't", "doesn't", "didn't", "can't", "couldn't", "won't", "wouldn't", "isn't", "aren't", "wasn't", "weren't"];


// Emojis and their sentiment
const EMOJI_MAP = {
  '😀': 1.5, '😃': 1.5, '😄': 1.5, '😁': 1.5, '😆': 1.5, '😍': 2, '🥰': 2, '😘': 1.5,
  '😂': 1.5, '🤣': 1.5, '😊': 1, '😌': 0.8, '🙂': 0.5,
  '😐': 0, '😑': 0, '😠': -1.5, '😡': -2, '😤': -1.5, '😢': -1.5, '😭': -2,
  '🤮': -2, '😱': -1, '😰': -1.5, '💔': -2, '👎': -1, '👍': 1
};

/**
 * Tokenize comment into lowercase words
 */
function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^\w\s\u0100-\uFFFF]/g, ' ') // Keep Unicode (emojis), remove most punctuation
    .split(/\s+/)
    .filter(w => w.length > 0);
}

/**
 * Extract emojis from text and calculate their sentiment contribution
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
 * Main sentiment analysis function
 * Returns { sentiment, score, confidence, details }
 */
function analyze(comment) {
  if (!comment || typeof comment !== 'string') {
    return { sentiment: 'Neutral', score: 0, confidence: 0, details: 'Invalid input' };
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

  // Analyze words with intensifiers and negations
  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    let wordScore = 0;

    // Check if word is in sentiment lexicon
    if (word in POSITIVE_WORDS) {
      wordScore = POSITIVE_WORDS[word];
    } else if (word in NEGATIVE_WORDS) {
      wordScore = NEGATIVE_WORDS[word];
    }

    if (wordScore !== 0) {
      // Check for negation (look back up to 3 words for better context)
      let isNegated = false;
      for (let j = Math.max(0, i - 3); j < i; j++) {
        if (NEGATIONS.includes(tokens[j])) {
          isNegated = true;
          break;
        }
      }
      
      // Check for intensifier (look back 1 word)
      let isIntensified = false;
      if (i > 0 && INTENSIFIERS.includes(tokens[i - 1])) {
        isIntensified = true;
      }

      // Apply negation first
      if (isNegated) {
        wordScore *= -1;
      }

      // Then apply intensifier
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
  const questionCount = (comment.match(/\?/g) || []).length;
  totalScore += exclamationCount * 0.3;
  if (exclamationCount > 0) details.push(`Exclamations (+${(exclamationCount * 0.3).toFixed(2)})`);
  if (questionCount > 0) details.push(`Questions: ${questionCount}`);

  // Map score to sentiment and calculate confidence
  let sentiment = 'Neutral';
  let confidence = 0;

  if (totalScore > 0.5) {
    sentiment = 'Positive';
    confidence = Math.min(1, Math.abs(totalScore) / 5);
  } else if (totalScore < -0.5) {
    sentiment = 'Negative';
    confidence = Math.min(1, Math.abs(totalScore) / 5);
  } else {
    sentiment = 'Neutral';
    confidence = 1 - Math.abs(totalScore) / 2;
  }

  return {
    sentiment,
    score: parseFloat(totalScore.toFixed(2)),
    confidence: parseFloat(confidence.toFixed(2)),
    details: details.slice(0, 10) // Limit details output
  };
}

module.exports = { analyze };

const fs = require('fs');
const path = require('path');
const { analyze } = require('./sentimentAnalyzer');

// Load sample comments
const commentsPath = path.join(__dirname, 'comments.json');
const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf8'));

console.log('='.repeat(80));
console.log('HEURISTIC SENTIMENT ANALYZER - YouTube Comment Analysis');
console.log('='.repeat(80));
console.log();

// Analyze each comment (silently)
const results = [];
comments.forEach((comment, index) => {
  const result = analyze(comment.text);
  results.push({ ...comment, ...result });
});

// Summary statistics
console.log();
console.log('SUMMARY STATISTICS');
console.log('='.repeat(80));
const positive = results.filter(r => r.sentiment === 'Positive').length;
const negative = results.filter(r => r.sentiment === 'Negative').length;
const neutral = results.filter(r => r.sentiment === 'Neutral').length;
const avgConfidence = (results.reduce((sum, r) => sum + r.confidence, 0) / results.length).toFixed(3);

console.log(`Total Comments: ${results.length}`);
console.log(`Positive: ${positive} (${(positive / results.length * 100).toFixed(1)}%)`);
console.log(`Negative: ${negative} (${(negative / results.length * 100).toFixed(1)}%)`);
console.log(`Neutral: ${neutral} (${(neutral / results.length * 100).toFixed(1)}%)`);
console.log(`Average Confidence: ${avgConfidence}`);
console.log('='.repeat(80));

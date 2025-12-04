const fs = require('fs');
const path = require('path');
const { provideFeedback, getModelStats, analyze } = require('./adaptiveAnalyzer');

/**
 * Training script that reads comments from JSON and trains the model
 * This will label the dataset and feed it to the learning algorithm
 */

const COMMENTS_FILE = path.join(__dirname, 'comments.json');

// Sentiment labels for each comment (based on analysis)
const SENTIMENT_LABELS = {
  1: 'Positive',    // "I love this video! Great content and very helpful."
  2: 'Negative',    // "This is terrible, worst video I've ever seen."
  3: 'Neutral',     // "The channel is ok, nothing special."
  4: 'Positive',    // "Amazing tutorial! This really helped me understand the concept. Thank you! 😍"
  5: 'Negative',    // "Total waste of time. Boring and useless."
  6: 'Neutral',     // "Not bad, but could be better."
  7: 'Negative',    // "I don't like this video very much."
  8: 'Positive',    // "Absolutely fantastic! Best video ever! 👍"
  9: 'Neutral',     // "This is just ok, nothing impressive."
  10: 'Negative',   // "Hate this channel! Everything is bad! 😡"
  11: 'Negative',   // "This is not good at all, very disappointing."
  12: 'Positive',   // "The video is extremely helpful and informative, thank you so much!"
  13: 'Positive',   // "Better than I expected, glad I watched this."
  14: 'Negative',   // "Absolutely awful! Worst explanation ever! This doesn't help at all."
  15: 'Positive',   // "This is not terrible, actually quite good."
  16: 'Neutral',    // "Meh, it's alright I guess. Nothing special but not bad either."
  17: 'Negative',   // "I'm really disappointed with this content. Very unhelpful."
  18: 'Positive',   // "Absolutely loved it! This is the best tutorial I've ever seen! 😍👍"
  19: 'Neutral',    // "Not good, not bad. Just average."
  20: 'Positive',   // "This helped me so much! Excellent explanation, very clear! Thank you!"
  21: 'Negative',   // "Horrible video. Complete waste of my time."
  22: 'Neutral',    // "It's okay but could be much better."
  23: 'Negative',   // "This is seriously the worst thing I've ever watched. Hate everything about it."
  24: 'Positive',   // "Pretty good content, enjoyed watching this! 😊"
  25: 'Negative',   // "Never seen such a bad explanation in my life!"
  26: 'Positive',   // "Excellent work! This is exactly what I needed. Fantastic!"
  27: 'Negative',   // "Not really my cup of tea, boring content."
  28: 'Positive',   // "Love the energy! Great production quality and very informative. Best channel!"
  29: 'Negative',   // "Don't waste your time on this video."
  30: 'Positive',   // "Surprisingly good! I thought it would be boring but it's actually amazing!"
  31: 'Negative',   // "This is not helpful and confusing. Very poor quality."
  32: 'Positive',   // "Finally found what I was looking for! Thank you so much! 👍😍"
  33: 'Negative',   // "Terrible explanation. Doesn't make any sense."
  34: 'Positive',   // "Amazing quality! Really appreciate the effort. Very well done!"
  35: 'Negative',   // "Not worth watching. Disappointing content."
  36: 'Positive',   // "Absolutely brilliant! Can't wait for more content like this!"
  37: 'Neutral',    // "Meh... nothing special. I've seen better."
  38: 'Positive',   // "This is fantastic! Really helped me understand. Extremely grateful!"
  39: 'Positive',   // "Not bad at all! Actually quite impressive for a free video."
  40: 'Negative'    // "Worst tutorial ever. Couldn't understand a thing. Terrible!"
};

async function trainModel() {
  console.log('='.repeat(80));
  console.log('ADAPTIVE SENTIMENT ANALYZER - Training Mode');
  console.log('='.repeat(80));
  console.log();

  // Load comments
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));
  
  console.log(`Loading ${comments.length} training examples...\n`);

  let trainedCount = 0;
  let errors = 0;

  // Train on each comment
  for (const comment of comments) {
    const correctSentiment = SENTIMENT_LABELS[comment.id];
    
    if (!correctSentiment) {
      console.log(`⚠️  No label for comment ${comment.id}, skipping...`);
      errors++;
      continue;
    }

    // Get prediction before training
    const prediction = analyze(comment.text);
    const wasCorrect = prediction.sentiment === correctSentiment;

    // Provide feedback to train
    const result = provideFeedback(comment.text, correctSentiment);

    // Log progress
    const status = wasCorrect ? '✓' : '✗';
    const shortComment = comment.text.substring(0, 50) + (comment.text.length > 50 ? '...' : '');
    console.log(`[${comment.id}] ${status} ${shortComment}`);
    console.log(`    Predicted: ${prediction.sentiment} | Actual: ${correctSentiment} | Score: ${prediction.score}`);
    
    trainedCount++;
  }

  console.log();
  console.log('='.repeat(80));
  console.log('Training Complete!');
  console.log('='.repeat(80));

  // Get final stats
  const stats = getModelStats();
  console.log(`\nModel Statistics:`);
  console.log(`  Total Feedback: ${stats.totalFeedback}`);
  console.log(`  Correct Predictions: ${stats.correctPredictions}`);
  console.log(`  Model Accuracy: ${stats.accuracy}`);
  console.log(`  Words Learned: ${stats.learnedWords}`);
  console.log(`  Positive Threshold: ${stats.thresholds.positive.toFixed(3)}`);
  console.log(`  Negative Threshold: ${stats.thresholds.negative.toFixed(3)}`);
  console.log();

  console.log('Model has been trained and saved to learningModel.json');
  console.log('Start the server with: node server.js');
  console.log();
}

// Run training
trainModel().catch(err => {
  console.error('Training error:', err);
  process.exit(1);
});

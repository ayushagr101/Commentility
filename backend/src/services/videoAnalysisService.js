import VideoSentiment from '../models/VideoAnalysis.js';

/**
 * Save sentiment analysis result
 * Input: userId, videoUrl, sentiment data from ML model
 */
export async function saveSentimentAnalysis(userId, videoUrl, sentimentData) {
  try {
    // Extract video ID from URL if possible
    let videoId = '';
    const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (match) {
      videoId = match[1];
    }

    // Create sentiment record
    const sentiment = new VideoSentiment({
      userId,
      videoUrl,
      videoId,
      sentiment: sentimentData.label.toLowerCase(),
      score: sentimentData.score
    });

    await sentiment.save();
    return sentiment;
  } catch (error) {
    throw new Error(`Failed to save sentiment: ${error.message}`);
  }
}

/**
 * Get all sentiments for a user
 */
export async function getUserSentiments(userId, limit = 20, skip = 0) {
  try {
    const sentiments = await VideoSentiment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await VideoSentiment.countDocuments({ userId });

    return {
      sentiments,
      total,
      hasMore: skip + sentiments.length < total
    };
  } catch (error) {
    throw new Error(`Failed to fetch sentiments: ${error.message}`);
  }
}

/**
 * Get sentiments filtered by type
 */
export async function getUserSentimentsByType(userId, sentimentType) {
  try {
    const sentiments = await VideoSentiment.find({
      userId,
      sentiment: sentimentType.toLowerCase()
    })
      .sort({ createdAt: -1 })
      .lean();

    return sentiments;
  } catch (error) {
    throw new Error(`Failed to fetch sentiments: ${error.message}`);
  }
}

/**
 * Get single sentiment record
 */
export async function getSingleSentiment(sentimentId, userId) {
  try {
    const sentiment = await VideoSentiment.findOne({
      _id: sentimentId,
      userId
    }).lean();

    if (!sentiment) {
      throw new Error('Sentiment record not found');
    }

    return sentiment;
  } catch (error) {
    throw new Error(`Failed to fetch sentiment: ${error.message}`);
  }
}

/**
 * Delete sentiment record
 */
export async function deleteSentiment(sentimentId, userId) {
  try {
    const result = await VideoSentiment.findOneAndDelete({
      _id: sentimentId,
      userId
    });

    if (!result) {
      throw new Error('Sentiment record not found');
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to delete sentiment: ${error.message}`);
  }
}

/**
 * Get statistics for user's sentiments
 */
export async function getSentimentStats(userId) {
  try {
    const stats = await VideoSentiment.aggregate([
      { $match: { userId: new (require('mongoose')).Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$sentiment',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      }
    ]);

    return stats;
  } catch (error) {
    throw new Error(`Failed to fetch statistics: ${error.message}`);
  }
}

import {
  saveSentimentAnalysis,
  getUserSentiments,
  getUserSentimentsByType,
  getSingleSentiment,
  deleteSentiment,
  getSentimentStats
} from '../services/videoAnalysisService.js';

/**
 * Save sentiment analysis result
 * POST /api/v1/analysis/sentiment
 */
export const saveSentiment = async (req, res) => {
  try {
    const { videoUrl, label, score } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!videoUrl || !label || score === undefined) {
      return res.status(400).json({
        message: 'videoUrl, label, and score are required'
      });
    }

    if (typeof score !== 'number' || score < 0 || score > 1) {
      return res.status(400).json({
        message: 'score must be a number between 0 and 1'
      });
    }

    const sentiment = await saveSentimentAnalysis(userId, videoUrl, {
      label,
      score
    });

    return res.status(201).json({
      success: true,
      message: 'Sentiment saved successfully',
      data: sentiment
    });
  } catch (error) {
    console.error('Save sentiment error:', error);
    return res.status(500).json({
      message: 'Failed to save sentiment',
      error: error.message
    });
  }
};

/**
 * Get all sentiments for current user
 * GET /api/v1/analysis
 */
export const getUserAnalyses = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    const result = await getUserSentiments(userId, limit, skip);

    return res.json({
      success: true,
      data: result.sentiments,
      pagination: {
        total: result.total,
        limit,
        skip,
        hasMore: result.hasMore
      }
    });
  } catch (error) {
    console.error('Get sentiments error:', error);
    return res.status(500).json({
      message: 'Failed to fetch sentiments',
      error: error.message
    });
  }
};

/**
 * Get sentiments filtered by type
 * GET /api/v1/analysis/sentiment/:type
 */
export const getSentimentsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!['positive', 'negative', 'neutral'].includes(type.toLowerCase())) {
      return res.status(400).json({
        message: 'Invalid sentiment type. Must be: positive, negative, or neutral'
      });
    }

    const sentiments = await getUserSentimentsByType(userId, type);

    return res.json({
      success: true,
      data: sentiments,
      count: sentiments.length
    });
  } catch (error) {
    console.error('Get sentiments by type error:', error);
    return res.status(500).json({
      message: 'Failed to fetch sentiments',
      error: error.message
    });
  }
};

/**
 * Get single sentiment record
 * GET /api/v1/analysis/:id
 */
export const getSentiment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sentiment = await getSingleSentiment(id, userId);

    return res.json({
      success: true,
      data: sentiment
    });
  } catch (error) {
    console.error('Get sentiment error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: 'Failed to fetch sentiment',
      error: error.message
    });
  }
};

/**
 * Delete sentiment record
 * DELETE /api/v1/analysis/:id
 */
export const deleteSentimentRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await deleteSentiment(id, userId);

    return res.json({
      success: true,
      message: 'Sentiment record deleted successfully'
    });
  } catch (error) {
    console.error('Delete sentiment error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: 'Failed to delete sentiment',
      error: error.message
    });
  }
};

/**
 * Get sentiment statistics
 * GET /api/v1/analysis/stats
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const stats = await getSentimentStats(userId);

    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

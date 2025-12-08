import AnalysisHistory from '../models/analysisHistory.model.js';

// Get user's analysis history
export async function getUserHistory(req, res) {
  try {
    const userId = req.user._id;
    
    // Get most recent 20 analyses
    const history = await AnalysisHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('videoId videoTitle channelTitle createdAt')
      .lean();
    
    return res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return res.status(500).json({
      message: 'Failed to fetch analysis history',
      error: error.message
    });
  }
}

// Get specific analysis by ID
export async function getHistoryById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const analysis = await AnalysisHistory.findOne({
      _id: id,
      userId: userId  // Ensure user can only access their own history
    }).lean();
    
    if (!analysis) {
      return res.status(404).json({
        message: 'Analysis not found'
      });
    }
    
    // Format response similar to analyze-comments endpoint
    return res.json({
      success: true,
      data: {
        summary: {
          totalComments: analysis.totalComments,
          videoId: analysis.videoId,
          videoTitle: analysis.videoTitle,
          channelTitle: analysis.channelTitle,
          commentSummary: analysis.commentSummary,
          topComment: analysis.topComment,
          netSentiment: analysis.netSentiment
        },
        sentimentGraph: analysis.sentimentGraph ? `data:image/png;base64,${analysis.sentimentGraph}` : null,
        wordcloud: analysis.wordcloud ? `data:image/png;base64,${analysis.wordcloud}` : null,
        topComments: analysis.topComments || []
      }
    });
  } catch (error) {
    console.error('Failed to fetch analysis:', error);
    return res.status(500).json({
      message: 'Failed to fetch analysis',
      error: error.message
    });
  }
}

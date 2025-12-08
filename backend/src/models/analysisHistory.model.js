import mongoose from 'mongoose';

const AnalysisHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    videoId: {
      type: String,
      required: true,
      trim: true
    },
    videoTitle: {
      type: String,
      required: true,
      trim: true
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true
    },
    channelTitle: {
      type: String,
      trim: true
    },
    commentSummary: {
      type: String
    },
    totalComments: {
      type: Number,
      default: 0
    },
    netSentiment: {
      type: String
    },
    sentimentGraph: {
      type: String  // base64 encoded image
    },
    wordcloud: {
      type: String  // base64 encoded image
    },
    topComment: {
      text: String,
      author: String,
      likes: Number
    },
    topComments: [{
      text: String,
      author: String,
      likes: Number
    }]
  },
  { 
    timestamps: true 
  }
);

// Index for efficient querying
AnalysisHistorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('AnalysisHistory', AnalysisHistorySchema);

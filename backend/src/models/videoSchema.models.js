import mongoose from 'mongoose';

const VideoSentimentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true
    },
    videoId: {
      type: String,
      trim: true,
      index: true
    },
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      required: true,
      index: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for efficient querying
VideoSentimentSchema.index({ userId: 1, createdAt: -1 });
VideoSentimentSchema.index({ userId: 1, sentiment: 1 });

export default mongoose.model('VideoSentiment', VideoSentimentSchema);
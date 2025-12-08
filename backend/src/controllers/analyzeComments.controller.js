import { fetchThreads, fetchVideoDetails } from './comments.js';
import AnalysisHistory from '../models/analysisHistory.model.js';
import { generateGrokSummary } from '../services/grokService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

// Helper function to flatten comment threads into text array
function flattenCommentsToText(threads) {
  const comments = [];
  
  threads.forEach(thread => {
    const topComment = thread.snippet.topLevelComment;
    comments.push({
      text: topComment.snippet.textDisplay,
      author: topComment.snippet.authorDisplayName,
      likeCount: topComment.snippet.likeCount,
      publishedAt: topComment.snippet.publishedAt
    });
    
    // Add replies if they exist
    const replies = thread.replies?.comments || [];
    replies.forEach(reply => {
      comments.push({
        text: reply.snippet.textDisplay,
        author: reply.snippet.authorDisplayName,
        likeCount: reply.snippet.likeCount,
        publishedAt: reply.snippet.publishedAt
      });
    });
  });
  
  return comments;
}

// Helper function to generate an enhanced summary of comments
function generateCommentSummary(comments) {
  if (!comments || comments.length === 0) {
    return "No comments available for analysis.";
  }

  const totalComments = comments.length;
  
  // Calculate engagement metrics
  const totalLikes = comments.reduce((sum, c) => sum + c.likeCount, 0);
  const avgLikes = (totalLikes / totalComments).toFixed(1);
  const highlyEngaged = comments.filter(c => c.likeCount > avgLikes * 2).length;
  
  // Get top comments
  const topComments = [...comments]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 5);
  
  // Enhanced keyword extraction with better filtering
  const wordFrequency = {};
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'is', 'was', 'are', 'were', 'this', 'that', 'it', 'be', 'have', 'has', 'had', 
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might',
    'i', 'you', 'he', 'she', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their',
    'from', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'just', 'like', 'really', 'very', 'too', 'also', 'only', 'even', 'much', 'more',
    'than', 'such', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
    'few', 'some', 'any', 'many', 'most', 'other', 'another', 'been', 'being',
    'video', 'videos', 'comment', 'comments', 'watching', 'watch', 'watched'
  ]);
  
  // Sentiment indicators
  const positiveWords = new Set([
    'great', 'amazing', 'awesome', 'excellent', 'perfect', 'love', 'loved', 'best',
    'wonderful', 'fantastic', 'brilliant', 'beautiful', 'good', 'nice', 'thanks',
    'thank', 'helpful', 'appreciate', 'appreciated', 'enjoyed', 'enjoy'
  ]);
  
  const negativeWords = new Set([
    'bad', 'terrible', 'awful', 'worst', 'hate', 'hated', 'poor', 'disappointing',
    'disappointed', 'useless', 'waste', 'boring', 'bored', 'confused', 'confusing'
  ]);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  comments.forEach(comment => {
    const words = comment.text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));
    
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      if (positiveWords.has(word)) positiveCount++;
      if (negativeWords.has(word)) negativeCount++;
    });
  });
  
  // Get top keywords (excluding sentiment words for themes)
  const topKeywords = Object.entries(wordFrequency)
    .filter(([word]) => !positiveWords.has(word) && !negativeWords.has(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => word);
  
  // Determine overall sentiment
  let sentimentPhrase = "mixed reactions";
  const sentimentRatio = positiveCount / (positiveCount + negativeCount + 1);
  if (sentimentRatio > 0.7) {
    sentimentPhrase = "overwhelmingly positive feedback";
  } else if (sentimentRatio > 0.55) {
    sentimentPhrase = "mostly positive reactions";
  } else if (sentimentRatio < 0.3) {
    sentimentPhrase = "predominantly negative feedback";
  } else if (sentimentRatio < 0.45) {
    sentimentPhrase = "mixed to negative reactions";
  }
  
  // Build enhanced summary
  let summary = `📊 **Engagement Overview**: This video has received ${totalComments} comments with ${sentimentPhrase}. `;
  
  if (highlyEngaged > 0) {
    const engagementPercent = ((highlyEngaged / totalComments) * 100).toFixed(0);
    summary += `${engagementPercent}% of comments show high engagement (above-average likes). `;
  }
  
  if (topKeywords.length > 0) {
    summary += `\n\n🔑 **Key Themes**: Viewers are discussing: ${topKeywords.slice(0, 5).join(', ')}. `;
  }
  
  if (topComments.length > 0) {
    const topComment = topComments[0];
    const preview = topComment.text.length > 120 
      ? topComment.text.substring(0, 120).trim() + '...' 
      : topComment.text;
    summary += `\n\n💬 **Top Comment** (${topComment.likeCount.toLocaleString()} likes): "${preview}"`;
  }
  
  return summary;
}

// Main controller function
export async function analyzeComments(req, res) {
  const tempFiles = [];
  
  try {
    const { youtubeUrl } = req.body;
    
    if (!youtubeUrl) {
      return res.status(400).json({ message: 'YouTube URL is required' });
    }
    
    // Extract video ID
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }
    
    console.log(`📹 Analyzing video: ${videoId}`);
    
    // Fetch video details
    let videoDetails = null;
    try {
      videoDetails = await fetchVideoDetails(videoId);
      console.log(`📺 Video title: ${videoDetails.title}`);
    } catch (error) {
      console.error('Failed to fetch video details:', error);
      // Continue without video details
    }
    
    // Fetch comments from YouTube (limit to 150 comments)
    const threads = await fetchThreads(videoId, 150);
    if (!threads || threads.length === 0) {
      return res.status(404).json({ message: 'No comments found for this video' });
    }
    
    // Flatten comments
    const comments = flattenCommentsToText(threads);
    console.log(`💬 Found ${comments.length} comments`);
    
    // Generate comment summary using Grok AI (with fallback)
    let commentSummary;
    try {
      console.log('🤖 Attempting to generate AI summary with Grok...');
      commentSummary = await generateGrokSummary(comments, {
        title: videoDetails?.title,
        channelTitle: videoDetails?.channelTitle
      });
      console.log('✅ Grok AI summary generated');
    } catch (grokError) {
      console.warn('⚠️ Grok API failed, using fallback summary:', grokError.message);
      commentSummary = generateCommentSummary(comments);
    }
    console.log(`📝 Summary: ${commentSummary}`);
    
    // Prepare temp directory in check folder
    const checkDir = path.join(__dirname, '../../../check');
    const timestamp = Date.now();
    const commentsFile = path.join(checkDir, `comments_${timestamp}.json`);
    const sentimentGraphFile = path.join(checkDir, 'sentiment_graph.png');
    const wordcloudFile = path.join(checkDir, 'wordcloud.png');
    const sentimentScoreFile = path.join(checkDir, 'net_sentiment.txt');
    
    tempFiles.push(commentsFile);
    
    // Save comments to JSON file (only text for sentiment analysis)
    const commentTexts = comments.map(c => c.text);
    fs.writeFileSync(commentsFile, JSON.stringify(commentTexts, null, 2));
    
    // Execute sentiment analysis
    console.log('🔍 Running sentiment analysis...');
    try {
      const { stdout, stderr } = await execAsync(
        `node sentiment.js "${commentsFile}"`,
        { cwd: checkDir, timeout: 300000 } // 5 minute timeout
      );
      
      if (stderr) {
        console.error('Sentiment analysis warnings:', stderr);
      }
      console.log('Analysis output:', stdout);
    } catch (execError) {
      console.error('Sentiment analysis error:', execError);
      throw new Error('Failed to run sentiment analysis: ' + execError.message);
    }
    
    // Read generated files
    let sentimentGraph = null;
    let wordcloud = null;
    let netSentiment = 'N/A';
    
    if (fs.existsSync(sentimentGraphFile)) {
      sentimentGraph = fs.readFileSync(sentimentGraphFile, 'base64');
    }
    
    if (fs.existsSync(wordcloudFile)) {
      wordcloud = fs.readFileSync(wordcloudFile, 'base64');
    }
    
    if (fs.existsSync(sentimentScoreFile)) {
      netSentiment = fs.readFileSync(sentimentScoreFile, 'utf8').trim();
    }
    
    // Generate summary
    const totalComments = comments.length;
    const topComments = comments
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 5);
    
    const topComment = topComments[0] || null;
    
    const summary = {
      totalComments,
      videoId,
      videoTitle: videoDetails?.title || 'Unknown Video',
      channelTitle: videoDetails?.channelTitle || null,
      commentSummary,
      topComment: topComment ? {
        text: topComment.text,
        author: topComment.author,
        likes: topComment.likeCount
      } : null,
      netSentiment
    };
    
    // Clean up temp files
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`🗑️ Deleted temp file: ${path.basename(file)}`);
      }
    });
    
    // Save to history if user is authenticated
    if (req.user) {
      try {
        await AnalysisHistory.create({
          userId: req.user._id,
          videoId,
          videoTitle: videoDetails?.title || 'Unknown Video',
          videoUrl: youtubeUrl,
          channelTitle: videoDetails?.channelTitle,
          commentSummary,
          totalComments,
          netSentiment,
          sentimentGraph,
          wordcloud,
          topComment: topComment ? {
            text: topComment.text,
            author: topComment.author,
            likes: topComment.likeCount
          } : null,
          topComments: topComments.slice(0, 3).map(c => ({
            text: c.text,
            author: c.author,
            likes: c.likeCount
          }))
        });
        console.log('✅ Analysis saved to history');
      } catch (historyError) {
        console.error('Failed to save history:', historyError);
        // Don't fail the request if history save fails
      }
    }
    
    // Return results
    return res.json({
      success: true,
      data: {
        summary,
        sentimentGraph: sentimentGraph ? `data:image/png;base64,${sentimentGraph}` : null,
        wordcloud: wordcloud ? `data:image/png;base64,${wordcloud}` : null,
        topComments: topComments.slice(0, 3).map(c => ({
          text: c.text,
          author: c.author,
          likes: c.likeCount
        }))
      }
    });
    
  } catch (error) {
    // Clean up temp files on error
    tempFiles.forEach(file => {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      } catch (e) {
        console.error('Error cleaning up temp file:', e);
      }
    });
    
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      message: 'Failed to analyze comments',
      error: error.message 
    });
  }
}

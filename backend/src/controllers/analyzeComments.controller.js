import { fetchThreads } from './comments.js';
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
    
    // Fetch comments from YouTube (limit to 150 comments)
    const threads = await fetchThreads(videoId, 150);
    if (!threads || threads.length === 0) {
      return res.status(404).json({ message: 'No comments found for this video' });
    }
    
    // Flatten comments
    const comments = flattenCommentsToText(threads);
    console.log(`💬 Found ${comments.length} comments`);
    
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
      }
    });
    
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

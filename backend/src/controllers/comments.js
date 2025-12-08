// backend/src/controllers/comments.js
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

export async function fetchThreads(videoId, maxComments = null) {
  const collected = [];
  let nextPageToken;

  do {
    const { data } = await youtube.commentThreads.list({
      part: 'snippet,replies',
      videoId,
      maxResults: 100,
      textFormat: 'plainText',
      pageToken: nextPageToken,
    });

    collected.push(...(data.items ?? []));
    nextPageToken = data.nextPageToken;
    
    // Stop if we've reached the max comments limit
    if (maxComments && collected.length >= maxComments) {
      return collected.slice(0, maxComments);
    }
  } while (nextPageToken);

  return collected;
}

function flattenComments(threads) {
  return threads.flatMap((thread) => {
    const top = thread.snippet.topLevelComment;
    const replies = thread.replies?.comments ?? [];

    return [
      {
        id: top.id,
        author: top.snippet.authorDisplayName,
        text: top.snippet.textDisplay,
        likeCount: top.snippet.likeCount,
        publishedAt: top.snippet.publishedAt,
        isReply: false,
      },
      ...replies.map((reply) => ({
        id: reply.id,
        parentId: top.id,
        author: reply.snippet.authorDisplayName,
        text: reply.snippet.textDisplay,
        likeCount: reply.snippet.likeCount,
        publishedAt: reply.snippet.publishedAt,
        isReply: true,
      })),
    ];
  });
}

export async function fetchVideoDetails(videoId) {
  try {
    const { data } = await youtube.videos.list({
      part: 'snippet,statistics',
      id: videoId,
    });

    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = data.items[0];
    return {
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      commentCount: video.statistics.commentCount,
    };
  } catch (error) {
    console.error('Failed to fetch video details:', error);
    throw error;
  }
}

export async function getComments(req, res) {
  try {
    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ message: 'Missing YouTube video id' });
    }

    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'GOOGLE_API_KEY') {
      return res.status(500).json({ message: 'YouTube API key not configured' });
    }

    const threads = await fetchThreads(videoId);
    const comments = flattenComments(threads);
    return res.json({comments});
  } catch (error) {
    console.error('Failed to fetch comments', error);
    return res.status(502).json({ message: 'Unable to fetch comments from YouTube' });
  }
}
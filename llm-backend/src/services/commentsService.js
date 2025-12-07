import { detectPlatform } from '../utils/detectPlatform.js';
import { fetchYoutubeComments } from '../tools/youtubeComments.js';
import { fetchTwitterComments } from '../tools/twitterComments.js';
import { fetchInstagramComments } from '../tools/instagramComments.js';

export async function getCommentsFromUrl(url, maxResults = 50) {
  const platform = detectPlatform(url);

  switch (platform) {
    case 'youtube':
      return await fetchYoutubeComments(url, maxResults);
    case 'twitter':
      return await fetchTwitterComments(url, maxResults);
    case 'instagram':
      return await fetchInstagramComments(url, maxResults);
    default:
      throw new Error(`Unsupported or unknown platform for URL: ${url}`);
  }
}

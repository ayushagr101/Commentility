import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 4000,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
  IG_ACCESS_TOKEN: process.env.IG_ACCESS_TOKEN,
};

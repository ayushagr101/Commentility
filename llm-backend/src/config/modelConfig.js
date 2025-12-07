import { ENV } from './env.js';

export const modelConfig = {
  baseURL: ENV.MODEL_BASE_URL,
  endpoints: {
    analyzeComments: '/analyze-comments', // your Docker model endpoint
  },
  timeout: 30000,
};

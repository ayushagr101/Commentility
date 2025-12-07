import express from 'express';
import {
  saveSentiment,
  getUserAnalyses,
  getSentimentsByType,
  getSentiment,
  deleteSentimentRecord,
  getStats
} from '../controllers/videoAnalysisController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Save sentiment analysis result from ML model
router.post('/sentiment', saveSentiment);

// Get all sentiments for current user
router.get('/', getUserAnalyses);

// Get sentiments by type (positive, negative, neutral)
router.get('/sentiment/:type', getSentimentsByType);

// Get single sentiment record
router.get('/:id', getSentiment);

// Delete sentiment record
router.delete('/:id', deleteSentimentRecord);

// Get sentiment statistics
router.get('/stats', getStats);

export default router;

// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const commentsController = require('../controllers/comments');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.post('/comments', commentsController.getComments);

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', auth, controller.getMe);
router.get("/comments/:videoId", controller.getComments);
module.exports = router;

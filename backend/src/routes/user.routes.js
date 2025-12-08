import { Router } from "express";
import { registerUser, loginUser, updateAvatar, getCurrentUser, logoutUser } from "../controllers/user.controller.js";
import { getComments } from "../controllers/comments.js";
import { analyzeComments } from "../controllers/analyzeComments.controller.js";
import { getUserHistory, getHistoryById } from "../controllers/history.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/multer.js";

const router = Router();

// Auth routes
router.post("/register", uploadSingle("avatar"), registerUser);
router.post("/signup", uploadSingle("avatar"), registerUser); // Alias for register
router.post("/login", loginUser);
router.post("/logout", authenticate, logoutUser);
router.get("/me", authenticate, getCurrentUser);

// User routes
router.patch("/avatar", authenticate, uploadSingle("avatar"), updateAvatar);
router.post("/get-comments", getComments);
router.post("/analyze-comments", authenticate, analyzeComments); // Now requires auth

// History routes
router.get("/history", authenticate, getUserHistory);
router.get("/history/:id", authenticate, getHistoryById);

export default router;

import { Router } from "express";
import { registerUser, loginUser, updateAvatar, getCurrentUser, logoutUser } from "../controllers/usercontroller.js";
import { handleOcrUpload } from "../controllers/ocrtestcontroller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/multer.js";

const router = Router();

// Auth routes
router.post("/register", uploadSingle("avatar"), registerUser);
router.post("/signup", uploadSingle("avatar"), registerUser); // Alias for register
router.post("/login", loginUser);
router.get("/current", authenticate, getCurrentUser);
router.post("/logout", authenticate, logoutUser);

// User routes
router.patch("/avatar", authenticate, uploadSingle("avatar"), updateAvatar);
router.post("/ocr", authenticate, uploadSingle("image"), handleOcrUpload);

export default router;

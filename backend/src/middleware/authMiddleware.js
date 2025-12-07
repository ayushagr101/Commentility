import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const extractTokenFromRequest = (req) => {
  const authHeader = req.headers?.authorization || "";

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "").trim();
  }

  return req.cookies?.accessToken || null;
};

export const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded?.sub || decoded?._id;

    if (!userId) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Access token has expired"
        : "Authentication failed";

    return res.status(401).json({ message });
  }
};

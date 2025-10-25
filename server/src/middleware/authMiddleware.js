// server/src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * protect - middleware to require a valid JWT
 * Expects Authorization header: "Bearer <token>"
 * Attaches req.user (without password) on success.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized, token missing" });

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

    // attach user (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message || err);
    return res.status(401).json({ message: "Not authorized: token invalid/expired" });
  }
};

/**
 * managerOnly - middleware to allow only users with role "manager"
 * Must be used after `protect` so req.user is available.
 */
export const managerOnly = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (req.user.role !== "manager") return res.status(403).json({ message: "Access denied: Managers only" });
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error checking role" });
  }
};

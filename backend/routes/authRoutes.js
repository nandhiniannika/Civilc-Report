import express from "express";
import {
  loginUser,
  registerUser,
  testAuth,
} from "../controllers/authController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Test route
router.get("/test", testAuth);

// ✅ Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Protected routes
router.get("/profile", authMiddleware, (req, res) => res.json(req.user));
router.get("/admin-area", authMiddleware, adminOnly, (req, res) =>
  res.json({ message: "Welcome, admin!" })
);

export default router;

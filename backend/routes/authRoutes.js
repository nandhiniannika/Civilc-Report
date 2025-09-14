import express from "express";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";
import { loginUser, registerUser, testAuth } from "../controllers/authController.js";

const router = express.Router();

router.get("/test", testAuth);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, (req, res) => res.json(req.user));
router.get("/admin-area", authMiddleware, adminOnly, (req, res) => res.json({ message: "Welcome, admin!" }));

export default router;

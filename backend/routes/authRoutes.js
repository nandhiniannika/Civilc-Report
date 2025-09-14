import express from "express";
import { testAuth, registerUser, loginUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Test route
router.get("/test", testAuth);

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected route
router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "This is your profile data",
        user: req.user,
    });
});

export default router;

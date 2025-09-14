const express = require("express");
const router = express.Router();
const { testAuth, registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

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

module.exports = router;

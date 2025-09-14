import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
import authRoutes from "./routes/authRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";  // <- new import

app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes);  // <- new route

// Test route
app.get("/", (req, res) => {
    res.send("Civic Issue Tracker API is running ✅");
});

// Connect DB and Start Server
const PORT = process.env.PORT || 5000;
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () =>
            console.log(`🚀 Server running on port ${PORT}`)
        );
    })
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

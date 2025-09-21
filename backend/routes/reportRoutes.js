import express from "express";
import {
  createReport,
  getReports,
  getReport,
  updateStatus,
  assignReport,
} from "../controllers/reportController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
// This route now correctly handles only the report data (no file upload)
router.post("/", authMiddleware, createReport);
// Consolidated getReports for both admin and users
router.get("/", authMiddleware, getReports);
// Get a single report
router.get("/:id", authMiddleware, getReport);

// Admin routes
// Use PUT for a full resource update like a status change
router.put("/:id/status", authMiddleware, adminOnly, updateStatus);
// Use PUT for a full resource update like assigning a department
router.put("/:id/assign", authMiddleware, adminOnly, assignReport);

export default router;
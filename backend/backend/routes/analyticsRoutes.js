import express from "express";
import {
  getReportsByCategory,
  getReportsByStatus,
  getReportsTrend,
  getAvgResolutionTime,
} from "../controllers/analyticsController.js";

const router = express.Router();

// Analytics Endpoints
router.get("/category", getReportsByCategory);
router.get("/status", getReportsByStatus);
router.get("/trends", getReportsTrend);
router.get("/response-time", getAvgResolutionTime);

export default router;

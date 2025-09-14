import express from "express";
import {
  listReports,
  getReport,
  updateStatus,
  assignReport,
  deleteReport,
  summary,
} from "../controllers/reportController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminOnly);

router.get("/", listReports);
router.get("/summary", summary);
router.get("/:id", getReport);
router.patch("/:id/status", updateStatus);
router.patch("/:id/assign", assignReport);
router.delete("/:id", deleteReport);

export default router;

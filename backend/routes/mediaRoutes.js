import express from "express";
import upload from "../utils/fileUpload.js";
import {
  uploadMedia,
  getAllMedia,
  getMediaByReport,
  deleteMedia,
} from "../controllers/mediaController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Upload a single file for a specific report
// Field name should match the frontend form ("image")
router.post(
  "/upload/:reportId",
  authMiddleware,
  upload.single("image"),
  uploadMedia
);

// ✅ Get all media (admin) or user-specific
router.get("/", authMiddleware, getAllMedia);

// ✅ Get media by report
router.get("/report/:reportId", authMiddleware, getMediaByReport);

// ✅ Delete media
router.delete("/:id", authMiddleware, deleteMedia);

export default router;

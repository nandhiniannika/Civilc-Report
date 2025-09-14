import express from "express";
import upload from "../utils/fileUpload.js";
import {
  uploadMedia,
  getAllMedia,
  deleteMedia,
  getMediaByReport
} from "../controllers/mediaController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Upload multiple files for a specific report
router.post(
  "/upload/:reportId",
  authMiddleware,
  upload.array("files", 5), // maximum 5 files per report
  uploadMedia
);

// Get all media files
router.get("/", authMiddleware, getAllMedia);

// Get all media files for a specific report
router.get("/report/:reportId", authMiddleware, getMediaByReport);

// Delete a media file by ID
router.delete("/:id", authMiddleware, deleteMedia);

export default router;

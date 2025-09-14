import Media from "../models/Media.js";
import Report from "../models/Report.js";
import fs from "fs";
import path from "path";

// Upload media for a report
export const uploadMedia = async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const mediaDocs = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      fileType: file.mimetype,
      url: `/uploads/${file.filename}`,
      uploadedBy: req.user ? req.user.id : null,
      report: reportId,
    }));

    const savedMedia = await Media.insertMany(mediaDocs);

    report.media = report.media ? report.media.concat(savedMedia.map(m => m._id)) : savedMedia.map(m => m._id);
    await report.save();

    res.status(201).json(savedMedia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all media
export const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get media by report
export const getMediaByReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const media = await Media.find({ report: reportId }).sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete media
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    const filePath = path.join("uploads", media.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (media.report) {
      await Report.findByIdAndUpdate(media.report, { $pull: { media: media._id } });
    }

    await media.deleteOne();
    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

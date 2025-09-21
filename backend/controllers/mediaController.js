import Media from "../models/Media.js";
import Report from "../models/Report.js";

// Upload media for a report
export const uploadMedia = async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // User can only upload to their own report
    if (req.user.role !== "admin" && report.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: cannot upload to this report" });
    }

    // Use actual filename and save it in MongoDB
    const filename = req.file.filename; // Multer sets this
    const url = `/uploads/${filename}`;  // relative URL, frontend will prepend backend URL

    const newMedia = new Media({
      filename: filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      url: url, 
      uploadedBy: req.user._id,
      report: reportId,
    });

    const savedMedia = await newMedia.save();
    report.media.push(savedMedia._id);
    await report.save();

    res.status(201).json(savedMedia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all media (admin) or user-specific
export const getAllMedia = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== "admin") {
      filter.uploadedBy = req.user._id;
    }

    const media = await Media.find(filter).sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get media for a specific report
export const getMediaByReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Regular user can only see their own report media
    if (req.user.role !== "admin" && report.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const media = await Media.find({ report: reportId }).sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete media (requires file system logic, which is removed for clarity and safety)
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    // Users can delete only their own media
    if (req.user.role !== "admin" && media.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: cannot delete this media" });
    }

    // Since we're not saving files locally, we skip the fs.unlinkSync part.
    // In a real app, you would delete the file from your cloud storage here.

    // Remove media reference from the report
    if (media.report) {
      await Report.findByIdAndUpdate(media.report, { $pull: { media: media._id } });
    }

    await media.deleteOne();
    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
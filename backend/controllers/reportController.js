import Report from "../models/Report.js";
import Media from "../models/Media.js";
import mongoose from "mongoose";

// Create report (user)
export const createReport = async (req, res) => {
  try {
    const { title, description, categoryId, priority, location } = req.body;

    if (!title || !categoryId || !location) {
      return res.status(400).json({ message: "Title, category, and location are required" });
    }

    const [longitude, latitude] = location.split(",").map(Number);
    if (isNaN(longitude) || isNaN(latitude)) {
      return res.status(400).json({ message: "Invalid location format" });
    }

    const report = new Report({
      title,
      description,
      category: categoryId,
      priority,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      createdBy: req.user._id,
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all reports (admin sees all, user sees their own)
export const getReports = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      filter.createdBy = req.user._id;
    }

    const reports = await Report.find(filter)
      .populate("createdBy", "name email")
      .populate("category", "name")
      .populate("department", "name") // Now safe to populate
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Failed to fetch reports due to a server error." });
  }
};

// Get single report
export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("category", "name")
      .populate("department", "name") // Now safe to populate
      .populate("media");

    if (!report) return res.status(404).json({ message: "Report not found" });

    // Regular user can only access their own report
    if (
      req.user.role !== "admin" &&
      req.user.role !== "superadmin" &&
      report.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(report);
  } catch (err) {
    console.error("Error fetching single report:", err);
    res.status(500).json({ message: err.message });
  }
};

// Admin: update status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const validStatuses = [
      "pending",
      "acknowledged",
      "in_progress",
      "resolved",
      "rejected",
      "closed",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    report.status = status;
    report.activity.push({
      action: `status_${status}`,
      actorId: req.user._id,
      actorName: req.user.name,
      note,
    });

    await report.save();
    res.json({ message: "Status updated", report });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: err.message });
  }
};

// Admin: assign report to department
export const assignReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentId, note } = req.body;

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: "Invalid department ID" });
    }

    report.department = departmentId;
    report.activity.push({
      action: "assigned",
      actorId: req.user._id,
      actorName: req.user.name,
      note: note || `Assigned to department ID: ${departmentId}`,
    });

    await report.save();

    const updatedReport = await Report.findById(id)
      .populate("createdBy", "name email")
      .populate("category", "name")
      .populate("department", "name")
      .populate("media")
      .populate("activity.actorId", "name");

    res.json({ message: "Report assigned", report: updatedReport });
  } catch (err) {
    console.error("Error assigning report:", err);
    res.status(500).json({ message: err.message });
  }
};

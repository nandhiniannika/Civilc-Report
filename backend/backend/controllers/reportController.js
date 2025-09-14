import Report from "../models/Report.js";
import mongoose from "mongoose";
import Department from "../models/Department.js"; // optional

// ✅ List Reports
export const listReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      assigned,
      fromDate,
      toDate,
      q,
      sort = "-createdAt",
      bbox,
    } = req.query;

    const filter = {};
    if (status) filter.status = { $in: status.split(",") };
    if (category) filter.category = { $in: category.split(",") };
    if (assigned === "true") filter.assignedTo = { $exists: true, $ne: null };
    if (q) filter.$text = { $search: q };
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    if (bbox) {
      const coords = bbox.split(",").map(Number);
      if (coords.length === 4) {
        const [minLng, minLat, maxLng, maxLat] = coords;
        filter.location = {
          $geoWithin: { $box: [[minLng, minLat], [maxLng, maxLat]] },
        };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [total, items] = await Promise.all([
      Report.countDocuments(filter),
      Report.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate("createdBy", "name phone email")
        .populate("assignedTo", "name contact_info")
        .lean(),
    ]);

    return res.json({
      meta: { total, page: Number(page), limit: Number(limit) },
      data: items,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Single Report
export const getReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });

    const report = await Report.findById(id)
      .populate("createdBy", "name phone email")
      .populate("assignedTo", "name contact_info");

    if (!report) return res.status(404).json({ message: "Report not found" });
    return res.json(report);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Report Status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!["pending", "acknowledged", "in_progress", "resolved", "rejected", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = status;
    report.activity.push({
      action: `status_${status}`,
      actorId: req.user?._id || null,
      actorName: req.user?.name || "system",
      note,
    });

    await report.save();

    return res.json({ message: "Status updated", report });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Assign Report
export const assignReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentId, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    if (departmentId) {
      const dept = await Department.findById(departmentId);
      if (!dept) return res.status(400).json({ message: "Invalid department" });
      report.assignedTo = dept._id;
    }

    report.activity.push({
      action: "assigned",
      actorId: req.user?._id || null,
      actorName: req.user?.name || "system",
      note: note || `Assigned to ${departmentId || "unknown"}`,
    });

    if (report.status === "pending") report.status = "acknowledged";

    await report.save();

    return res.json({ message: "Report assigned", report });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Report
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    await Report.findByIdAndDelete(id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Status Summary
export const summary = async (req, res) => {
  try {
    const agg = await Report.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
    ]);
    return res.json({ data: agg });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

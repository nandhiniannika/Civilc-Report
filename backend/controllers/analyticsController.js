import Report from "../models/Report.js";

// 1. Reports grouped by Category
export const getReportsByCategory = async (req, res) => {
  try {
    const data = await Report.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 2. Reports grouped by Status
export const getReportsByStatus = async (req, res) => {
  try {
    const data = await Report.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 3. Reports trend by day
export const getReportsTrend = async (req, res) => {
  try {
    const data = await Report.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 4. Average Resolution Time
export const getAvgResolutionTime = async (req, res) => {
  try {
    const data = await Report.aggregate([
      { $match: { resolvedAt: { $exists: true, $ne: null } } },
      {
        $project: {
          resolutionTime: { $subtract: ["$resolvedAt", "$createdAt"] },
        },
      },
      {
        $group: {
          _id: null,
          avgResolutionMs: { $avg: "$resolutionTime" },
        },
      },
    ]);

    if (data.length === 0) {
      return res.json({ avgResolutionDays: 0 });
    }

    const avgMs = data[0].avgResolutionMs;
    const avgDays = avgMs / (1000 * 60 * 60 * 24);

    res.json({ avgResolutionDays: avgDays.toFixed(2) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

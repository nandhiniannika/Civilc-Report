import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true, // image/png, video/mp4 etc.
  },
  url: {
    type: String,
    required: true, // stored file path or cloud URL
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Media", mediaSchema);

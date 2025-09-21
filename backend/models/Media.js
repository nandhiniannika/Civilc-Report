import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },      // unique filename from multer
    originalName: { type: String },                  // original uploaded filename
    fileType: { type: String },                      // MIME type
    url: { type: String, required: true },          // store filename only
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    report: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);

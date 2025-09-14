import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true, // Example: "pothole", "streetlight", "garbage"
    },
    status: {
      type: String,
      enum: ["pending", "acknowledged", "in_progress", "resolved", "rejected", "closed"],
      default: "pending",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to the User model
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department", // links to Department model
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media", // uploaded images/videos
      },
    ],
    resolvedAt: {
      type: Date,
    },
    activity: [
      {
        action: String,
        actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        actorName: String,
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // auto-creates createdAt & updatedAt
);

reportSchema.index({ location: "2dsphere" }); // for geo queries

const Report = mongoose.model("Report", reportSchema);

export default Report;

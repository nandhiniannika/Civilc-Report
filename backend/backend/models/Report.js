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
      required: true, // Example: "Pothole", "Streetlight", "Garbage"
    },
    status: {
      type: String,
      enum: ["Pending", "Acknowledged", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
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
  },
  { timestamps: true } // auto-creates createdAt & updatedAt
);

reportSchema.index({ location: "2dsphere" }); // for geo queries

const Report = mongoose.model("Report", reportSchema);

export default Report;

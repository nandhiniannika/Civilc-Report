import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Department schema
const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "" },
}, { timestamps: true });

const Department = mongoose.model("Department", departmentSchema);

// Default departments
const departments = [
  { name: "Public Works", description: "Handles roads and infrastructure" },
  { name: "Sanitation", description: "Handles waste management and cleaning" },
  { name: "Electricity", description: "Handles streetlights and electrical issues" },
  { name: "Traffic Police", description: "Handles traffic regulations and signals" },
  { name: "Water Works", description: "Handles water supply and drainage" },
];

const seedDepartments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected.");

    // Delete existing departments
    await Department.deleteMany({});
    console.log("Existing departments deleted.");

    // Insert new default departments
    for (const dept of departments) {
      await Department.create(dept);
      console.log(`Added department: ${dept.name}`);
    }

    console.log("Default departments seeded successfully.");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDepartments();

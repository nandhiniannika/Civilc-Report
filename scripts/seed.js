// scripts/seed.js (CommonJS version)
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Define schema and model
const categorySchema = new mongoose.Schema({
  name: String,
  description: String
});

const Category = mongoose.model("Category", categorySchema);

async function seed() {
  try {
    console.log("MONGO_URI =", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    await Category.deleteMany({});

    const sampleData = [
      { name: "Health", description: "Healthcare services" },
      { name: "Education", description: "Schools, colleges, and learning" },
      { name: "Infrastructure", description: "Roads, bridges, public works" }
    ];

    await Category.insertMany(sampleData);
    console.log("✅ Sample data inserted into 'categories' collection");

    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

seed();


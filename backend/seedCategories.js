import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

dotenv.config();

const categories = [
  { name: 'Pothole', description: 'Road potholes', icon: '🛣️' },
  { name: 'Streetlight', description: 'Streetlight issues', icon: '💡' },
  { name: 'Garbage', description: 'Garbage collection issues', icon: '🗑️' },
  { name: 'Water Logging', description: 'Flooding or drainage issues', icon: '🌊' },
  { name: 'Traffic Issues', description: 'Traffic signal or congestion', icon: '🚦' },
  { name: 'Noise Pollution', description: 'Noise complaints', icon: '🔊' },
  { name: 'Other', description: 'Other civic issues', icon: '⚠️' },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected.');

    // Delete existing categories first
    await Category.deleteMany({});
    console.log('Existing categories deleted.');

    // Insert new categories with emojis
    for (const cat of categories) {
      await Category.create(cat);
      console.log(`Added category: ${cat.icon} ${cat.name}`);
    }

    console.log('Default categories seeded with emojis.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCategories();

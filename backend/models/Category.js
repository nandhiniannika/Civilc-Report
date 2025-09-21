import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' }, // emoji or FontAwesome class
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);

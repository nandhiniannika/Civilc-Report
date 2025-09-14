// controllers/categoryController.js
const Category = require('../models/Category');

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, department } = req.body;
    if (!department) return res.status(400).json({ success: false, message: 'department is required' });
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ success: false, message: 'Category already exists' });

    const cat = await Category.create({ name, description, department });
    res.status(201).json({ success: true, data: cat });
  } catch (err) { next(err); }
};

exports.getCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search = '', active } = req.query;
    const q = {};
    if (search) q.name = new RegExp(search, 'i');
    if (active !== undefined) q.isActive = active === 'true';

    const categories = await Category.find(q)
      .populate('department', 'name contactEmail contactPhone')
      .skip((page-1) * limit)
      .limit(Number(limit));
    const total = await Category.countDocuments(q);
    res.json({ success: true, data: categories, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) { next(err); }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const cat = await Category.findById(req.params.id).populate('department', 'name contactEmail contactPhone');
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: cat });
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    // soft delete
    const cat = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deactivated', data: cat });
  } catch (err) { next(err); }
};

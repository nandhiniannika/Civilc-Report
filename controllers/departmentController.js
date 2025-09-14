// controllers/departmentController.js
const Department = require('../models/Department');
const Category = require('../models/Category');

exports.createDepartment = async (req, res, next) => {
  try {
    const { name, description, contactEmail, contactPhone, webhookUrl } = req.body;
    const existing = await Department.findOne({ name });
    if (existing) return res.status(400).json({ success: false, message: 'Department already exists' });

    const dept = await Department.create({ name, description, contactEmail, contactPhone, webhookUrl });
    res.status(201).json({ success: true, data: dept });
  } catch (err) { next(err); }
};

exports.getDepartments = async (req, res, next) => {
  try {
    // optional pagination/search
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = search ? { name: new RegExp(search, 'i') } : {};
    const departments = await Department.find(query)
      .skip((page-1) * limit)
      .limit(Number(limit))
      .lean();
    const total = await Department.countDocuments(query);
    res.json({ success: true, data: departments, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) { next(err); }
};

exports.getDepartmentById = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    // include categories handled by this department
    const categories = await Category.find({ department: dept._id }).select('name description isActive');
    res.json({ success: true, data: { department: dept, categories } });
  } catch (err) { next(err); }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, data: dept });
  } catch (err) { next(err); }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    // soft delete
    const dept = await Department.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, message: 'Department deactivated', data: dept });
  } catch (err) { next(err); }
};

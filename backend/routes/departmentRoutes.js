import express from 'express';
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { authMiddleware, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get all departments
router.get('/', getDepartments);

// Get a single department by ID
router.get('/:id', getDepartmentById);

// Admin-only routes
router.post('/', authMiddleware, adminOnly, createDepartment);
router.put('/:id', authMiddleware, adminOnly, updateDepartment);
router.delete('/:id', authMiddleware, adminOnly, deleteDepartment);

export default router;
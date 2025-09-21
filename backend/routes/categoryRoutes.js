import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/authMiddleware.js';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();

// A public route to get categories (so all users can see them on the report form)
router.get('/', getCategories);

// All other category actions require admin privileges
router.post('/', authMiddleware, adminOnly, createCategory);
router.put('/:id', authMiddleware, adminOnly, updateCategory);
router.delete('/:id', authMiddleware, adminOnly, deleteCategory);

export default router;
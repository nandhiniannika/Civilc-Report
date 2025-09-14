// routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/departmentController');

// Public or protected endpoints — add auth middleware if needed
router.post('/', ctrl.createDepartment);
router.get('/', ctrl.getDepartments);
router.get('/:id', ctrl.getDepartmentById);
router.put('/:id', ctrl.updateDepartment);
router.delete('/:id', ctrl.deleteDepartment);

module.exports = router;

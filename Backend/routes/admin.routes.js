/**
 * admin.routes.js
 * Admin-only routes
 */

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const adminController = require('../controllers/admin.controller');

// GET /api/admin/orders -> admin fetch all orders
router.get('/orders', authMiddleware, isAdmin, adminController.getAllOrdersForAdmin);

//GET /api/admin/hourly-summaries -> hourly summaries
router.get('/hourly-summaries', authMiddleware, isAdmin, adminController.getHourlySummaries);

module.exports = router;

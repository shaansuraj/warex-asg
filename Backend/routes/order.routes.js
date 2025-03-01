/**
 * order.routes.js
 * Routes for Order creation and fetching.
 */

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const { isUser } = require('../middlewares/role.middleware');
const orderController = require('../controllers/order.controller');

// POST /api/orders -> Create order (User only)
router.post('/', authMiddleware, isUser, orderController.createOrder);

// GET /api/orders -> Fetch orders (User sees own, Admin sees all)
router.get('/', authMiddleware, orderController.getAllOrders);

module.exports = router;

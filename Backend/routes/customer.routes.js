/**
 * customer.routes.js
 * Routes for Customer creation/fetching.
 */

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const { isUser } = require('../middlewares/role.middleware');
const customerController = require('../controllers/customer.controller');

// POST /api/customers -> create customer (User only)
router.post('/', authMiddleware, isUser, customerController.createCustomer);

// GET /api/customers -> fetch customers (User sees own, Admin sees all)
router.get('/', authMiddleware, customerController.getAllCustomers);

module.exports = router;

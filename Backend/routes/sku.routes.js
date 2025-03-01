/**
 * sku.routes.js
 * Routes for SKU creation/fetching.
 */

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const { isUser } = require('../middlewares/role.middleware');
const skuController = require('../controllers/sku.controller');

// POST /api/skus -> create SKU (User only)
router.post('/', authMiddleware, isUser, skuController.createSKU);

// GET /api/skus -> fetch SKUs (User sees own, Admin sees all)
router.get('/', authMiddleware, skuController.getAllSKUs);

module.exports = router;

/**
 * auth.routes.js
 * Routes for authentication (signup, login).
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;

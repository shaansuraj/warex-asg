/**
 * auth.controller.js
 * Handles signup and login logic.
 * 
 * @module controllers/authController
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Signup a new user (default role: user).
 * @param {*} req 
 * @param {*} res 
 */
exports.signup = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({
      username,
      password,
      role: role || 'user'
    });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

/**
 * Login user and return JWT token.
 * @param {*} req 
 * @param {*} res 
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.json({ token, role: user.role });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

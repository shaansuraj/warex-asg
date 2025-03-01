/**
 * admin.controller.js
 * Admin-only controllers for viewing all orders, 
 * or other admin functionalities.
 * 
 * @module controllers/adminController
 */

const Order = require('../models/order.model');

/**
 * Fetch all orders with customer and SKU details (Admin only).
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('customer')
      .populate('sku')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching all orders for admin', error: error.message });
  }
};

/**
 * Fetch all hourly summaries (Admin only).
 * @param {*} req 
 * @param {*} res 
 */

exports.getHourlySummaries = async (req, res) => {
  try {
    
    const summaries = await require('../models/hourlySummary.model').find().sort({ createdAt: -1 });
    return res.json(summaries);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching hourly summaries', error: error.message });
  }
};

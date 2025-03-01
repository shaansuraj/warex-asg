/**
 * order.controller.js
 * Handles Order creation and fetching for users.
 */

const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const SKU = require('../models/sku.model');
const idGenerator = require('../services/idGenerator');
const notificationService = require('../services/notification.service');

/**
 * Create a new Order (User only).
 * @param {*} req 
 * @param {*} res 
 */
exports.createOrder = async (req, res) => {
  try {
    const { customer_id, sku_id, quantity, rate } = req.body;

    // Lookup Customer using custom field "customer_id"
    const customer = await Customer.findOne({ customer_id: customer_id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // Ensure that the user only uses their own customer if role is user
    if (req.user.role === 'user' && customer.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not own this customer' });
    }

    // Lookup SKU using custom field "sku_id"
    const sku = await SKU.findOne({ sku_id: sku_id });
    if (!sku) {
      return res.status(404).json({ message: 'SKU not found' });
    }
    // Ensure that the user only uses their own SKU if role is user
    if (req.user.role === 'user' && sku.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not own this SKU' });
    }

    // Calculate total amount: (quantity * rate) * (1 + tax_rate/100)
    const totalAmount = quantity * rate * (1 + sku.tax_rate / 100);

    // Generate custom order ID
    const newOrderId = await idGenerator.generateOrderId();

    const newOrder = new Order({
      order_id: newOrderId,
      customer: customer._id, // Save the actual ObjectId reference
      sku: sku._id,           // Save the actual ObjectId reference
      quantity,
      rate,
      total_amount: totalAmount,
      createdBy: req.user._id
    });
    await newOrder.save();

    // Notify admins via WebSocket
    notificationService.notifyAdmins({
      message: 'New order placed',
      order_id: newOrderId,
      user: req.user.username,
      customer: customer.name,
      sku: sku.sku_name,
      total_amount: totalAmount,
      timestamp: new Date().toISOString()
    });

    return res.status(201).json({
      order_id: newOrderId,
      customer: customer.name,
      sku: sku.sku_name,
      total_amount: totalAmount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating Order', error: error.message });
  }
};

/**
 * Fetch all Orders:
 * - If admin, fetch all orders.
 * - If user, fetch only those created by the user.
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllOrders = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query.createdBy = req.user._id;
    }
    const orders = await Order.find(query)
      .populate('customer')
      .populate('sku')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching Orders', error: error.message });
  }
};

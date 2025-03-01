const Customer = require('../models/customer.model');
const idGenerator = require('../services/idGenerator'); // Import the generator

/**
 * Create a new Customer (User only).
 * @param {*} req 
 * @param {*} res 
 */
exports.createCustomer = async (req, res) => {
  try {
    const { name, address } = req.body;
    // Generate a new customer_id
    const customer_id = await idGenerator.generateCustomerId();

    const newCustomer = new Customer({
      customer_id,
      name,
      address,
      createdBy: req.user._id
    });
    await newCustomer.save();
    return res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating Customer', error: error.message });
  }
};

/**
 * Fetch all Customers:
 * - If admin, fetch all
 * - If user, fetch only those created by user
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllCustomers = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query.createdBy = req.user._id;
    }
    const customers = await Customer.find(query);
    return res.json(customers);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching Customers', error: error.message });
  }
};

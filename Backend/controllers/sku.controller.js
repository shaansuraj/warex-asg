const SKU = require('../models/sku.model');
const idGenerator = require('../services/idGenerator'); // Import the generator

/**
 * Create a new SKU (User only).
 * @param {*} req 
 * @param {*} res 
 */
exports.createSKU = async (req, res) => {
  try {
    const { sku_name, unit_of_measurement, tax_rate } = req.body;
    // Generate a new sku_id
    const sku_id = await idGenerator.generateSKUId();

    const newSKU = new SKU({
      sku_id,
      sku_name,
      unit_of_measurement,
      tax_rate,
      createdBy: req.user._id
    });
    await newSKU.save();
    return res.status(201).json({ message: 'SKU created successfully', sku: newSKU });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating SKU', error: error.message });
  }
};

/**
 * Fetch all SKUs.
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllSKUs = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query.createdBy = req.user._id;
    }
    const skus = await SKU.find(query);
    return res.json(skus);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching SKUs', error: error.message });
  }
};

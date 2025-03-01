/**
 * sku.model.js
 * Mongoose model for SKU.
 */

const mongoose = require('mongoose');

const skuSchema = new mongoose.Schema({
  sku_id: {
    type: String,
    unique: true
  },
  sku_name: {
    type: String,
    required: true
  },
  unit_of_measurement: {
    type: String,
    required: true
  },
  tax_rate: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SKU', skuSchema);

/**
 * counter.model.js
 * Mongoose model to store sequence counters (e.g., for order IDs).
 */

const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Counter', counterSchema);

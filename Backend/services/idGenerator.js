const Counter = require('../models/counter.model');

/**
 * Generate a new ID based on the counter name and prefix.
 * @param {string} counterName - The name of the counter (e.g., 'orderId', 'customerId', 'skuId').
 * @param {string} prefix - The prefix to use ('OD', 'CUST', 'SKU').
 * @returns {Promise<string>} - The generated ID.
 */
async function generateId(counterName, prefix) {
  const counter = await Counter.findOneAndUpdate(
    { _id: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seqStr = counter.seq.toString().padStart(5, '0');
  return `${prefix}-${seqStr}`;
}

module.exports = {
  generateOrderId: async () => generateId('orderId', 'OD'),
  generateCustomerId: async () => generateId('customerId', 'CUST'),
  generateSKUId: async () => generateId('skuId', 'SKU'),
};

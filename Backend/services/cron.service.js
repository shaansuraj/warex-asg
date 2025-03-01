/**
 * cron.service.js
 * Manages the hourly order summary generation.
 */

const Order = require('../models/order.model');
const HourlySummary = require('../models/hourlySummary.model');

/**
 * Generate an order summary for the past hour.
 * This function is triggered every hour by node-cron.
 */
exports.generateHourlyOrderSummary = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Get orders created in the last hour
    const recentOrders = await Order.find({
      createdAt: { $gte: oneHourAgo }
    });

    let totalOrders = recentOrders.length;
    let totalAmount = 0;
    recentOrders.forEach(order => {
      totalAmount += order.total_amount;
    });

    // Create the summary object
    const summary = {
      total_orders: totalOrders,
      total_amount: totalAmount,
      timestamp: new Date() // Current time for the summary
    };

    // Logging to console to check
    console.log('Hourly Order Summary:', summary);

    // Saving to HourlySummary collection
    await HourlySummary.create(summary);

    return summary;
  } catch (error) {
    console.error('Error generating hourly order summary:', error);
  }
};

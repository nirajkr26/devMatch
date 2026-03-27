/**
 * Razorpay SDK initialization.
 * Creates a global instance used for interacting with the Razorpay API.
 */
const Razorpay = require('razorpay');

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

// Create singleton instance with API credentials
var instance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});

module.exports = instance;
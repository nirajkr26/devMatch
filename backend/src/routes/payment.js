const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants")
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')
const crypto = require("crypto");
const User = require("../models/user");

const paymentService = require("../services/paymentService");

/**
 * Route to initiate a new premium subscription payment.
 * Creates a Razorpay order via the payment service.
 */
router.post("/payment/create", userAuth, async (req, res, next) => {
    try {
        const { membershipType } = req.body;
        // Delegate order creation logic to service layer
        const savedPayment = await paymentService.createPayment(req.user, membershipType);

        // Send payment details and public Razorpay Key to frontend to trigger UI
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    } catch (err) {
        next(err);
    }
})

/**
 * Route to verify the outcome of a payment.
 * Validates the HMAC signature provided by Razorpay frontend.
 */
router.post("/payment/verify", userAuth, async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Perform server-side validation of the signature
        const payment = await paymentService.verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        return res.json({
            success: true,
            message: "Payment verified successfully",
            payment,
        });
    } catch (err) {
        console.error("Payment verify error:", err);
        // Specifically handle signature mismatches as user-facing errors
        if (err.message === "Invalid signature") {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;


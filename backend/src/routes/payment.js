const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants")
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')
const crypto = require("crypto");

router.post("/payment/create", userAuth, async (req, res) => {
    try {
        const { membershipType } = req.body;
        const { firstName, lastName, emailId } = req.user;

        const order = await razorpayInstance.orders.create({
            "amount": membershipAmount[membershipType],
            "currency": "INR",
            "receipt": "receipt123",
            "notes": {
                firstName,
                lastName,
                emailId,
                membershipType: membershipType,
            }
        })

        console.log(order);
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        })

        const savedPayment = await payment.save();

        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
})

router.post("/payment/verify", userAuth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature === razorpay_signature) {
            const payment = await Payment.findOneAndUpdate(
                { orderId: razorpay_order_id },
                {
                    paymentId: razorpay_payment_id,
                    status: "paid",
                },
                { new: true }
            );

            return res.json({
                success: true,
                message: "Payment verified successfully",
                payment,
            });
        } else {
            return res
                .status(400)
                .json({ success: false, message: "Invalid signature" });
        }
    } catch (err) {
        console.error("Payment verify error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;


const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants")

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


module.exports = router;


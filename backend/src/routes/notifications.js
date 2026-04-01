import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { Notification } from "../models/notification.js";
import User from "../models/user.js";

const router = express.Router();

/**
 * Route to fetch all notifications for the logged-in user.
 * Supports pagination to ensure fast loading as historical data grows.
 */
router.get("/notifications", userAuth, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ recipient: userId })
            .populate("sender", "firstName lastName photoUrl")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUnread = await Notification.countDocuments({ 
            recipient: userId, 
            isRead: false 
        });

        res.json({
            notifications,
            totalUnread,
            currentPage: page,
            hasNextPage: notifications.length === limit
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Route to mark all notifications as read.
 */
router.patch("/notifications/read-all", userAuth, async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        next(err);
    }
});

/**
 * Route to register a Web Push subscription for the current user.
 */
router.post("/notifications/subscribe", userAuth, async (req, res, next) => {
    try {
        const subscription = req.body;
        const user = await User.findById(req.user._id);

        // Check if subscription already exists (prevent duplicates)
        const exists = user.pushSubscriptions.some(
            s => s.endpoint === subscription.endpoint
        );

        if (!exists) {
            user.pushSubscriptions.push(subscription);
            await user.save();
        }

        res.status(201).json({ message: "Subscription added successfully" });
    } catch (err) {
        next(err);
    }
});

export default router;

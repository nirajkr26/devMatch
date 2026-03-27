const express = require("express")
const router = express.Router();

const { Chat, Message } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

/**
 * Route to fetch chat history between the current user and a target user.
 * Automatically initializes a new chat document if one doesn't exist.
 */
router.get("/chat/:targetUserId", userAuth, async (req, res, next) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user._id

        // Find existing chat containing BOTH participants
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        })

        // If no chat exists (first time messaging), create it
        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId]
            });
            await chat.save();
        }

        const { before } = req.query;
        let query = { chatId: chat._id };

        // If 'before' is provided, we fetch messages created before that specific message's timestamp/id
        if (before) {
            // Using the _id of the message we're loading before (since ObjectId contains timestamp)
            query._id = { $lt: before };
        }

        // Fetch paginated messages
        const limit = 20;
        const messages = await Message.find(query)
            .sort({ createdAt: -1 }) // Get newest first
            .limit(limit)
            .populate({
                path: "senderId",
                select: "firstName lastName photoUrl" // Add photoUrl for UI
            });

        // We reverse them so they appear chronologically in the UI (oldest at top, newest at bottom of the batch)
        messages.reverse();

        res.json({
            chatId: chat._id,
            participants: chat.participants,
            messages
        });
    } catch (err) {
        next(err);
    }
})


module.exports = router

const express = require("express")
const router = express.Router();

const { Chat } = require("../models/chat");
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
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName" // Only fetch name for UI
        })

        // If no chat exists (first time messaging), create it
        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            })

            await chat.save();
        }

        res.json(chat);
    } catch (err) {
        next(err);
    }
})


module.exports = router

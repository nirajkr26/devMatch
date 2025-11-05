const express = require("express")
const router = express.Router();

const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

router.get("/chat/:targetUserId", userAuth,async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user._id

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName"
        })

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            })

            await chat.save();
        }

        res.json(chat);
    } catch (err) {
        res.status(500).send(err.message);
    }
})


module.exports = router

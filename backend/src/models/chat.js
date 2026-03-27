const mongoose = require("mongoose");
/**
 * Chat Model Schemas.
 * Defines individual messages and the overall chat container between users.
 */

// Main chat schema representing a conversation thread
const chatSchema = new mongoose.Schema({
    // The two users participating in the chat
    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ]
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

// Schema for individual messages within a chat, stored in their own collection
const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
        index: true // Index for fast cursor-based pagination
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
}, {
    timestamps: true // Track when each message was sent
});

// Index to optimize reverse chronological fetches per chat room
messageSchema.index({ chatId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = { Chat, Message };
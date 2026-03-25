const mongoose = require("mongoose");
/**
 * Chat Model Schemas.
 * Defines individual messages and the overall chat container between users.
 */

// Schema for individual messages within a chat
const messageSchema = new mongoose.Schema({
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
})

// Main chat schema representing a conversation thread
const chatSchema = new mongoose.Schema({
    // The two users participating in the chat
    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    // Array of embedded message documents
    messages: [messageSchema]
})

const Chat = mongoose.model("Chat", chatSchema);

module.exports = { Chat }
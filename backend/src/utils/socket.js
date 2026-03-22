const socket = require("socket.io")
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const { ConnectionRequest } = require("../models/connRequest")
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * WebSocket utility using Socket.io for real-time messaging.
 */

// Generate a deterministic and unique room ID based on user pairs
const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}

/**
 * Socket.io server initialization and event management.
 * Handles authentication, room logic, and event-based communication.
 */
const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        },
    })

    /**
     * Socket Authentication Middleware
     * Validates connection attempts by checking JWT token from cookies.
     */
    io.use(async (socket, next) => {
        try {
            const cookiesHeader = socket.handshake.headers.cookie;
            if (!cookiesHeader) {
                console.log("Socket Auth Error: No cookies found in handshake");
                return next(new Error("Authentication error"));
            }

            // Extract token robustly by parsing the cookie string
            const tokenCookie = cookiesHeader.split("; ").find(c => c.startsWith("token="));
            if (!tokenCookie) {
                console.log("Socket Auth Error: Token cookie not found");
                return next(new Error("Authentication error"));
            }
            const token = tokenCookie.split("=")[1];

            // Verify JWT
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (jwtErr) {
                console.log("Socket Auth Error: JWT Verify Failed:", jwtErr.message);
                return next(new Error("Authentication error"));
            }

            if (!decoded) {
                console.log("Socket Auth Error: Decoded payload is null");
                return next(new Error("Authentication error"));
            }

            // Prefetch user details once and attach to socket session
            // This avoids redundant DB calls inside frequent events like "sendMessage"
            const user = await User.findById(decoded._id).select("firstName lastName");
            if (!user) {
                console.log("Socket Auth Error: User document not found for ID:", decoded._id);
                return next(new Error("User not found"));
            }

            socket.user = user;
            next();
        } catch (err) {
            console.error("Socket Auth Exception:", err);
            next(new Error("Authentication error"));
        }
    });

    /**
     * Handle incoming socket connections
     */
    io.on("connection", (socket) => {

        // Listen for requests to join a private chat room between two users
        socket.on("joinChat", ({ userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId); // Client joins their unique specific room
        })

        // Listen for new chat messages
        socket.on("sendMessage", async ({ userId, targetUserId, text }) => {
            try {
                const roomId = getSecretRoomId(userId, targetUserId)
                const { firstName, lastName } = socket.user;

                // Security check: only allow messaging if connection status is "accepted"
                const conn = await ConnectionRequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                        { fromUserId: targetUserId, toUserId: userId, status: "accepted" }
                    ]
                })

                if (!conn) throw new Error("Not friends");

                // Find or create the persistent Chat document
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                })

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }

                // Add message to chat history and save to DB
                chat.messages.push({
                    senderId: userId,
                    text
                })

                await chat.save();

                // Broadcast message only to participants in the specific room
                io.to(roomId).emit("messageReceived", { firstName, lastName, text })
            } catch (err) {
                console.error("Socket Error (sendMessage):", err);
            }
        })

        socket.on("disconnect", () => {
            // Cleanup or logging on disconnect can be added here
        })
    })

}

module.exports = initializeSocket
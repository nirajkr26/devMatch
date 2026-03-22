/**
 * Main application entry point for the DevMatch backend.
 * Initializes the Express server, connects to the database, and sets up real-time communication.
 */
const env = require("./config/env");
const express = require("express");
const { userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
require("dotenv").config();
const http = require("http");

const app = express();

// Middlewares
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies from requests
app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow requests from specified frontend URL
    credentials: true // Allow sending cookies in cross-origin requests
}))

// Import Routers
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat")
const initializeSocket = require("./utils/socket");

// Route Handlers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

// Initialize HTTP Server and Socket.io
const server = http.createServer(app);
initializeSocket(server);

// Connect to Database and start server
connectDB().then(() => {
    console.log("database connected");
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    });

}).catch(err => {
    console.error("Database connection failed:", err);
})

/**
 * Global Error Handler Middleware
 * Catches all errors thrown in routes and sends a formatted response.
 */
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.message || "Internal Server Error");
});

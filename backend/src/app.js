const env = require("./config/env");
const express = require("express");
const { userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const http = require("http");
const { connectRedis, redisClient } = require("./config/redis");
const { createGlobalLimiter } = require("./config/rateLimiter");
const mongoose = require("mongoose");
require("dotenv").config();


const app = express();

// Trust proxy for production (Render/Cloudflare)
// This is required for express-rate-limit to work correctly behind a proxy
app.set("trust proxy", 1);

/** 
 * Standard Middlewares
 */
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

/**
 * Health Check Endpoint
 * Provides system status and database connectivity info
 */
app.get("/health", async (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: new Date().toISOString(),
        systems: {
            mongodb: mongoose.connection.readyState === 1 ? 'up' : 'down',
            redis: redisClient.isOpen ? 'up' : 'down'
        }
    };

    try {
        if (healthcheck.systems.mongodb === 'down' || healthcheck.systems.redis === 'down') {
            res.status(503).json(healthcheck);
        } else {
            res.status(200).json(healthcheck);
        }
    } catch (error) {
        healthcheck.message = error;
        res.status(503).json(healthcheck);
    }
});


/**
 * Import Router Factories (to avoid early Redis access)
 */
const setupAuthRoutes = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat")
const initializeSocket = require("./utils/socket");

const server = http.createServer(app);
initializeSocket(server);

/**
 * STARTUP PIPELINE
 */

console.log("🚀 Starting System Initialization...");

connectDB()
    .then(() => {
        console.log("✅ Step 1: MongoDB connected");
        return connectRedis();
    })
    .then(() => {
        console.log("✅ Step 2: Upstash Redis connected");

        // Now that Redis is open, we can safely initialize our limiters
        const globalLimiter = createGlobalLimiter();
        app.use(globalLimiter);

        // Inject the rate limiters into the Auth Router
        const authRouter = setupAuthRoutes();

        // Register Routes
        app.use("/", authRouter);
        app.use("/", profileRouter);
        app.use("/", requestRouter);
        app.use("/", userRouter);
        app.use("/", paymentRouter);
        app.use("/", chatRouter);

        // Global Error Handler (MUST be registered AFTER routes)
        app.use((err, req, res, next) => {
            res.header("Content-Type", "application/json");
            const statusCode = err.status || 500;
            res.status(statusCode).json({
                message: err.message || "Internal Server Error"
            });
        });

        console.log("✅ Step 3: Routes & Limiters Registered");

        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`✅ Step 4: Server fully operational on port ${PORT} 🚀`);
        });
    })
    .catch(err => {
        console.error("❌ CRITICAL FAILURE DURING STARTUP:");
        console.error(err);
        process.exit(1);
    });


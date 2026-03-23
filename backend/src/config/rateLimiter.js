const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const { redisClient } = require("./redis");

/**
 * Factory functions to create limiters ONLY after Redis is connected
 */

const createGlobalLimiter = () => rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: "rl:global:",
    }),
    message: "Too many requests from this IP, Try again after 15 minutes"
});

const createAuthLimiter = () => rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: "rl:auth:",
    }),
    message: "Too many authentication attempts, Try again after 1 hour"
});

const createOtpLimiter = () => rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: "rl:otp:",
    }),
    message: "Too many OTP requests, Try again after 5 minutes"
});

module.exports = {
    createGlobalLimiter,
    createAuthLimiter,
    createOtpLimiter
};

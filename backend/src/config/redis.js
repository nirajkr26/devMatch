const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Cache Error', err));

const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("Connected to Upstash Redis 💨");
        }
    } catch (err) {
        console.error("Could not connect to Redis", err);
    }
};

module.exports = { redisClient, connectRedis };

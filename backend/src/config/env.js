/**
 * Environment configuration and validation.
 * Ensures the application starts with all required configuration parameters.
 */
require("dotenv").config();

// List of mandatory environment variables for the application to function correctly
const requiredEnvs = [
    "FRONTEND_URL",
    "MONGO_URI",
    "JWT_SECRET",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "REDIS_URL",
    "RESEND_API_KEY",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "PORT",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "GITHUB_CALLBACK_URL"
];

/**
 * Validates the current process.env against the required list.
 * Logs a warning if any expected variables are missing.
 */
const validateEnv = () => {
    const missing = requiredEnvs.filter(env => !process.env[env]);
    if (missing.length > 0) {
        console.warn(`Missing required environment variables: ${missing.join(", ")}`);
    }
}

// Perform validation on module load
validateEnv();

// Export the process.env object for easy access throughout the backend
module.exports = process.env;

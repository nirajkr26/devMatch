const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * Authentication Middleware for the DevMatch application.
 * Verifies the presence and validity of a JWT token stored in a cookie.
 * Attaches the authenticated user document to the request object.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const userAuth = async (req, res, next) => {
    try {
        // Retrieve token from the request cookies
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Please Login!!");
        }

        // Verify the JWT token using the secret stored in env variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decoded;

        // Fetch user from database using the ID from the decoded token
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("user not found");
        }

        // Attach authenticated user to the request for use in route handlers
        req.user = user
        next();
    } catch (err) {
        // Respond with Unauthorized if token is invalid or user doesn't exist
        res.status(401).send(err.message)
    }
}

module.exports = {
    userAuth
}


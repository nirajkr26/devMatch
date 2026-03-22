const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const { validateSignUpData } = require("../utils/validation")
const User = require("../models/user");
const cookieConfig = require("../config/cookieConfig");

/**
 * Auth routes for user signup, login, and logout.
 */

/**
 * Handle user signup.
 * Validates request data, hashes password, saves user, and issues a JWT token.
 */
router.post("/signup", async (req, res, next) => {
    try {
        // Validate input data (names, email format, password strength)
        validateSignUpData(req);
        const { firstName, lastName, age, gender, emailId, password } = req.body;

        // Create new user instance (password is hashed in User model's pre-save middleware)
        const user = new User({
            firstName, lastName, age, gender, emailId, password
        });

        const savedUser = await user.save();

        // Generate and set authentication token
        const token = await savedUser.getJWT();
        res.cookie("token", token, cookieConfig);
        res.send(savedUser)
    } catch (err) {
        next(err);
    }
})

/**
 * Handle user login.
 * Verifies credentials and issues a JWT token in a cookie.
 */
router.post("/login", async (req, res, next) => {
    try {
        const { emailId, password } = req.body;

        // Find user by email
        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("invalid credentials")
        }

        // Check if the provided password matches the stored hash
        const isValidPassword = await user.validatePassword(password);

        if (isValidPassword) {
            // Re-issue JWT token on successful login
            const token = await user.getJWT();
            res.cookie("token", token, cookieConfig);
            res.send(user)
        } else {
            throw new Error("invalid credentials")
        }
    } catch (err) {
        next(err);
    }
})

/**
 * Handle user logout.
 * Clears the authentication token by expiring the cookie.
 */
router.post("/logout", async (req, res, next) => {
    // Overwrite existing token with null and expire it immediately
    res.cookie("token", null, {
        ...cookieConfig,
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful");
})

module.exports = router;

const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const User = require("../models/user");
const validator = require("validator")
const bcrypt = require("bcrypt")

/**
 * Route to view the authenticated user's own profile.
 * Retrieves user data from the req.user object attached by auth middleware.
 */
router.get("/profile/view", userAuth, async (req, res, next) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (err) {
        next(err);
    }
})

/**
 * Route to edit profile details.
 * Validates fields before updating the user document in the database.
 */
router.patch("/profile/edit", userAuth, async (req, res, next) => {
    try {
        // Run input validation (checks keys and values)
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid edit request")
        }

        const loggedUser = req.user;

        // Dynamically update user fields based on request body
        Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));

        // Persist changes to database. Mongoose handles validation of values.
        await loggedUser.save();

        res.json({
            message: `${loggedUser.firstName} ! your profile updated successfully`,
            data: loggedUser
        })

    } catch (err) {
        next(err);
    }
})

/**
 * Route to change user password.
 * Requires current password verification and strong new password validation.
 */
router.patch("/profile/password", userAuth, async (req, res, next) => {
    try {
        const { password, newPassword } = req.body;
        const loggedUser = req.user;

        // Step 1: Verify current password
        const isValid = await loggedUser.validatePassword(password);

        if (!isValid) {
            return res.status(400).send("invalid password")
        }

        // Step 2: Validate new password strength
        const isStrongPassword = validator.isStrongPassword(newPassword);
        if (!isStrongPassword) {
            return res.status(400).send("weak password")
        }

        // Step 3: Update and save (hashing happens in User model pre-save hook)
        loggedUser.password = newPassword;
        await loggedUser.save();

        res.send("password updated successfully")

    } catch (err) {
        next(err);
    }
})


module.exports = router;
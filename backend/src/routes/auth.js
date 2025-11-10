const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt")
const { validateSignUpData } = require("../utils/validation")
const User = require("../models/user")

router.post("/signup", async (req, res) => {

    validateSignUpData(req);
    const { firstName, lastName, age, gender, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
        firstName, lastName, age, gender, emailId, password: passwordHash
    });

    const savedUser = await user.save();

    const token = await savedUser.getJWT();

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }),

        res.send(savedUser)
})

router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("invalid credentials")
        }

        const isValidPassword = await user.validatePassword(password);

        if (isValidPassword) {
            const token = await user.getJWT();

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }),

                res.send(user)
        } else {
            throw new Error("invalid credentials")
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
})

router.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful");
})

module.exports = router;

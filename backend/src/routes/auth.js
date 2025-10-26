const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt")
const { validateSignUpData } = require("../utils/validation")
const User = require("../models/user")

router.post("/signup", async (req, res) => {

    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash)
    const user = new User({
        firstName, lastName, emailId, password: passwordHash
    });

    await user.save();
    res.send("user added")
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

            res.cookie("token", token),

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
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful");
})

module.exports = router;

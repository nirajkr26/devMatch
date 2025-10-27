const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const User = require("../models/user");
const validator = require("validator")
const bcrypt = require("bcrypt")

router.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        res.send(user)
    } catch (err) {
        res.status(500).send(err.message);
    }
})

router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid edit request")
        }

        const loggedUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));

        // const updateDb = await User.findByIdAndUpdate(loggedUser._id,loggedUser)

        await loggedUser.save();

        console.log(loggedUser)
        res.send(`${loggedUser.firstName} ! your profile updated successfully`)

    } catch (err) {
        res.status(500).send(err.message);
    }
})

router.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        const loggedUser = req.user;
        const isValid = await loggedUser.validatePassword(password);

        if (!isValid) {
            res.send("invalid password")
        }

        const isStrongPassword = validator.isStrongPassword(newPassword);
        if (!isStrongPassword){
            res.send("weak password")
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        loggedUser.password = hashedPassword;
        await loggedUser.save();

        res.send("password updated successfully")

    } catch (err) {
        res.status(500).send(err.message);
    }
})


module.exports = router;
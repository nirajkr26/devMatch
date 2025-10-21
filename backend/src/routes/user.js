const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connRequest");
const User = require("../models/user");

//gets all pending connection requests of  user
router.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName");
        // }).populate("fromUserId", ["firstName", "lastName","age"]);    

        res.json({ message: "fetched all requests " + connectionRequests });

    } catch (err) {
        res.status(400).send(err.message);
    }
})


module.exports = router;
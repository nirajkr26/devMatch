const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connRequest");
const User = require("../models/user");

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id; //logged in user
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status })
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).send("user does not exist");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        })

        if (existingConnectionRequest) {
            return res.status(400).send("connection request already exists")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })
        const data = await connectionRequest.save();

        res.json({
            message: status + " " + toUser.firstName,
            data,
        })

    } catch (err) {
        res.status(400).send(err.message);
    }
})

router.post("/request/review/:status/:id", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const status = req.params.status;
        const requestId = req.params.id;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if (!connectionRequest) {
            return res.status(404).json({ message: "connection request not found" })
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({ message: "connection request " + status, data })

        

    } catch (err) {
        res.status(400).send(err.message);
    }

})



module.exports = router;
const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connRequest");
const User = require("../models/user");

/**
 * Route to send a connection request (interested or ignored).
 * Handles the initial interaction between two users.
 */
router.post("/request/send/:status/:toUserId", userAuth, async (req, res, next) => {
    try {
        const fromUserId = req.user._id; // Logged in user initiating the request
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Step 1: Validate intended status
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status })
        }

        // Step 2: Ensure the recipient user exists
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).send("user does not exist");
        }

        // Step 3: Check for existing relationships (requests already sent/received)
        // This prevents duplicate requests or conflicting states
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        })

        if (existingConnectionRequest) {
            return res.status(400).send("connection request already exists")
        }

        // Step 4: Create and save the new connection request
        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })
        const data = await connectionRequest.save();

        res.json({
            message: status + " " + toUser.firstName,
            data,
        })

    } catch (err) {
        err.status = 400;
        next(err);
    }
})

/**
 * Route to review (accept/reject) a received connection request.
 * Only the recipient of the "interested" request can review it.
 */
router.post("/request/review/:status/:id", userAuth, async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const status = req.params.status;
        const requestId = req.params.id;

        // Step 1: Validate desired review status
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status })
        }

        // Step 2: Find the specific pending request aimed at the current user
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id, // Must be addressed to the logged-in user
            status: "interested"        // Status must be 'interested' to be reviewable
        })

        if (!connectionRequest) {
            return res.status(404).json({ message: "connection request not found" })
        }

        // Step 3: Update the status and save
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({ message: "connection request " + status, data })
    } catch (err) {
        err.status = 400;
        next(err);
    }
})

module.exports = router;
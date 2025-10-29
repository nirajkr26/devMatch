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
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills");
        // }).populate("fromUserId", ["firstName", "lastName","age"]);    

        res.json({
            message: "fetched all requests ",
            data: connectionRequests
        });

    } catch (err) {
        res.status(400).send(err.message);
    }
})

router.get("/user/connections", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ],
        }).populate("fromUserId", "firstName lastName age gender photoUrl about").populate("toUserId", "firstName lastName age gender photoUrl about");

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data });

    } catch (err) {
        res.status(400).send(err.message);
    }
})

router.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName age gender about skills photoUrl").skip(skip).limit(limit);

        res.json({ data: users });


    } catch (err) {
        res.status(400).send(err.message);
    }
})


module.exports = router;
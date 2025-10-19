const express = require("express");
const { userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");

const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const secret = "veryStrongSecret"
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);



connectDB().then(() => {
    console.log("database connected");
    app.listen(3000, () => {
        console.log("server running on port 3000")
    });

}).catch(err => {
    console.error(err);
})



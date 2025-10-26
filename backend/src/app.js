const express = require("express");
const { userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const cors = require("cors");

const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const secret = "veryStrongSecret"
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);



connectDB().then(() => {
    console.log("database connected");
    app.listen(3000, () => {
        console.log("server running on port 3000")
    });

}).catch(err => {
    console.error(err);
})



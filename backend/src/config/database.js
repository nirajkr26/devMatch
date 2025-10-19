const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGO_URI;

const connectDB = async () => {
    await mongoose.connect(MONGODB_URI);
}

module.exports = connectDB


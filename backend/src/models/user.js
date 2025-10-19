const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const secret = "veryStrongSecret"
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email address:" + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
        max: 60,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("gender is not accepted")
            }
        }
    },
    photoUrl: {
        type: String,
        validator(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Email address:" + value)
            }
        }

    },
    about: {
        type: String,
        default: "Default value",
    },
    skills: {
        type: [String],
    }

}, {
    timestamps: true,
});

userSchema.methods.getJWT = function () {
    const user = this;

    const token = jwt.sign({ _id: user._id }, secret, { expiresIn: "1d" });

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;

    const valid = await bcrypt.compare(passwordInputByUser, user.password);

    return valid;
}


const User = mongoose.model("User", userSchema);

module.exports = User

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
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not valid gender type`
        },
        // validate(value) {
        //     if (!["male", "female", "others"].includes(value)) {
        //         throw new Error("gender is not accepted")
        //     }
        // }
    },
    photoUrl: {
        type: String,
        validator(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Email address:" + value)
            }
        },
        default:"https://i.pinimg.com/originals/00/28/c7/0028c71f6fe9fce5f87d117f5c5aeeee.jpg",

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

userSchema.index({ firstName: 1, lastName: 1 });

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

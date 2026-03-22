const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * User Model Schema definition and methods.
 * Defines the structure of the user document and includes business logic for auth.
 */
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

        validate(value) {
            // Ensure email format is valid
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
        default: 18
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not valid gender type`
        },
        default: "others"
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    membershipType: {
        type: String,
    },
    photoUrl: {
        type: String,
        validate(value) {
            // Ensure profile photo URL is valid
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL:" + value)
            }
        },
        default: "https://i.pinimg.com/originals/00/28/c7/0028c71f6fe9fce5f87d117f5c5aeeee.jpg",
    },
    about: {
        type: String,
        default: "Default value",
    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true, // Auto-manage createdAt and updatedAt fields
});

// Optimization for searching users by name
userSchema.index({ firstName: 1, lastName: 1 });

/**
 * Filter sensitive information when document is serialized to JSON.
 */
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password; // Never send password to frontend
    return userObject;
}

/**
 * Generate a JWT token for authentication for the current user.
 */
userSchema.methods.getJWT = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
}

/**
 * Compare plain text password input with stored hash.
 */
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const valid = await bcrypt.compare(passwordInputByUser, user.password);
    return valid;
}

/**
 * Pre-save middleware to hash passwords before storing in database.
 */
userSchema.pre("save", async function (next) {
    const user = this;
    // Only re-hash if password is newly set or changed
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User

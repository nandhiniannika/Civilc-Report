const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // no duplicate emails
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, { timestamps: true }); // adds createdAt & updatedAt

module.exports = mongoose.model("User", userSchema);
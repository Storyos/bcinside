const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    liked_post: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User",
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User",
    }],
    blocked:[{
        type:mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User"
    }]


})

const User = mongoose.model("User", userSchema);

module.exports = User;

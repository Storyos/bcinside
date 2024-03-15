const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        default:"",
        required: false,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    liked_post: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Post",
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Post",
    }],
    blocked:[{
        type:mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User",
        unique: true,
    }]


})

const User = mongoose.model("User", userSchema);

module.exports = User;

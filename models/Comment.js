const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  isReply: { type: Boolean, required: true },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Post",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

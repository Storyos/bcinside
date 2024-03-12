const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  like: {
    type: Number,
    default: 0,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

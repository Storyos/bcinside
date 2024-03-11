const Post = require("../models/Post");
const Comment = require("../models/Comment");

const getPosts = async (req, res) => {
  const posts = await Post.find();
  if (!posts) return res.status(404).render("404");
  res.render("posts", posts);
};

const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("User").populate("Comment");
  const comments = post.comments;
  // 댓글과 대댓글 구분해서 받아오기
  if (!post) return res.status(404).render("404");
  return res.render("watch", post);
};

const getMakePost = (req, res) => {
  res.render("makePost");
};

const postMakePost = async (req, res) => {
  const { title, category, content } = req.body;
  const {
    user: { _id },
  } = req.session;

  try {
    await Post.create({
      title,
      category,
      content,
      user: _id,
    });
  } catch (error) {
    console.log(error);
  }

  res.redirect("/");
};

module.exports = { getPosts, getPost, getMakePost, postMakePost };

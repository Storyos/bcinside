const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

const getIndex = async (req, res) => {
  // 모든 게시글을 받아옴
  const posts = await Post.find();
  if (!posts)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  res.status(200).render("index", posts);
};

const getAllPosts = async (req, res) => {
  // 모든 게시글을 받아옴
  const posts = await Post.find();
  if (!posts)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  return res.status(200).render("post_list", { posts });
};

const getCategory = async (req, res) => {
  // 게시판이 같은 게시글을 받아옴
  const { category } = req.params;
  const posts = await Post.find({ category });
  if (!posts)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  return res.status(200).render("post_list", posts, category);
};

const getSearchResult = async (req, res) => {
  // 게시판이 같은 게시글을 받아옴
  const keyword = req.query.keyword;
  console.log(keyword);
  const posts = await Post.find({ title: { $regex: keyword, $options: "i" } });
  if (!posts)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  return res.status(200).render("searchResult", posts, keyword);
};

const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("User").populate("Comment");
  if (!post)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  const comments = post.comments;
  const originComments = comments.filter((comment) => comment.isReply !== true);
  const replyComments = comments.filter((comment) => comment.isReply === true);
  return res
    .status(200)
    .render("post", { post, originComments, replyComments });
  //comment는 html tag id값에 collection id 값을 저장해야 한다 ex) comment-list.id = originComment._id
};

const getMakePost = (req, res) => {
  res.status(200).render("post_write");
};

const postMakePost = async (req, res) => {
  const { title, category, content } = req.body;
  const {
    user: { _id },
  } = req.session;

  try {
    const newPost = await Post.create({
      title,
      category,
      content,
      user: _id,
    });
    const user = await User.findById(_id);
    user.posts.push(newPost._id);
    user.save();
    // 작성한 post를 작성자의 user collection에도 반영
    res.redirect(201, `/post/${newPost._id}`);
  } catch (error) {
    return res
      .status(400)
      .render("error", (errorMessage = "Can not make post"));
  }
};

const getUpdatePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  return res.status(201).render("post-update", post);
};

const postUpdatePost = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, category, content } = req.body;
  const post = await findById(id);
  if (!post)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  if (String(post.user) !== String(_id)) {
    // 게시글 작성자가 맞는지 확인
    return res
      .status(403)
      .render("error", (errorMessage = "Forbidden Approach"));
  }
  await findByIdAndUpdate(id, { title, category, content });
  return res.redirect(201, `/post/${id}`);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const post = await Post.findById(id);
  if (!post)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  if (String(post.user) !== String(_id)) {
    // 게시글 작성자가 맞는지 확인
    return res
      .status(403)
      .render("error", (errorMessage = "Forbidden Approach"));
  }
  await Post.findByIdAndDelete(id);
  return res.redirect(200, "/post");
};

module.exports = {
  getPost,
  getMakePost,
  postMakePost,
  deletePost,
  postUpdatePost,
  getUpdatePost,
  getIndex,
  getCategory,
  getAllPosts,
  getSearchResult,
};

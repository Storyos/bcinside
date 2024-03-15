const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const formattedDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

const getIndex = async (req, res) => {
  // 모든 게시글을 받아옴
  const newPosts = await Post.find().populate("user");
  if (!newPosts)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  newPosts.sort(function compare(a, b) {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  const hotPosts = newPosts.filter(() => true);
  hotPosts.sort(function compare(a, b) {
    return b.like - a.like;
  });
  res.status(200).render("index", { newPosts, hotPosts, formattedDate });
};

const getAllPosts = async (req, res) => {
  // 모든 게시글을 받아옴
  const posts = await Post.find().populate("user");
  if (!posts)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  posts.sort(function compare(a, b) {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  return res.status(200).render("post_list", { posts, formattedDate });
};

const getCategory = async (req, res) => {
  // 게시판이 같은 게시글을 받아옴
  const { category } = req.params;
  const posts = await Post.find({ category }).populate("user");

  if (!posts)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  posts.sort(function compare(a, b) {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  return res
    .status(200)
    .render("post_list", { posts, category, formattedDate });
};

const getSearchResult = async (req, res) => {
  // 게시판이 같은 게시글을 받아옴
  const keyword = req.query.keyword;
  const posts = await Post.find({ title: { $regex: keyword, $options: "i" } });
  if (!posts)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  console.log(posts);
  return res
    .status(200)
    .render("search-result", { posts, keyword, formattedDate });
};

const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("user");
  const date = post.createdAt.toLocaleString();
  if (!post)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  const comments = await Comment.find({ post: id }).populate("user");
  const originComments = comments.filter((comment) => comment.isReply !== true);
  const replyComments = comments.filter((comment) => comment.isReply === true);
  return res
    .status(200)
    .render("post", { post, originComments, replyComments, formattedDate });
  //comment는 html tag id값에 collection id 값을 저장해야 한다 ex) comment-list.id = originComment._id
};

const getMakePost = (req, res) => {
  res.status(200).render("post_write");
};

const postMakePost = async (req, res) => {
  const { title, category, content } = req.body;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, jwtSecret);
  const _id = decoded.id;
  try {
    const newPost = await Post.create({
      title,
      category,
      content,
      user: _id,
    });

    const user = await User.findById(_id);
    user.posts.push(newPost.id);
    user.save();
    // 작성한 post를 작성자의 user collection에도 반영
    res.status(201).render("post", { post: newPost, formattedDate });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .render("error", { errorMessage: "Can not make post" });
  }
};

const getUpdatePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  return res.status(201).render("post-update", { post });
};

const postUpdatePost = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, jwtSecret);
  const _id = decoded.id;
  const { title, category, content } = req.body;
  const post = await Post.findById(id);
  if (!post)
    return res.status(404).render("error", (errorMessage = "404 NOT FOUND"));
  if (String(post.user) !== String(_id)) {
    // 게시글 작성자가 맞는지 확인
    return res
      .status(403)
      .render("error", (errorMessage = "Forbidden Approach"));
  }
  await Post.findByIdAndUpdate(id, { title, category, content });
  return res.status(201).redirect(`/posts/${id}`);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, jwtSecret);
  const _id = decoded.id;
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
  return res.status(200).redirect("/");
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, jwtSecret);
  const _id = decoded.id;

  const post = await Post.findById(id);
  if (!post) return console.log("댓글작성에 실패했습니다");
  // 게시글 or 유저 정보 확인 실패
  try {
    const newComment = await Comment.create({
      user: _id,
      text,
      post: id,
      isReply: false,
    });
    post.comments.push(newComment._id);
    post.save();
    res.status(201).redirect(`/posts/${id}`);
    // const commentElement = document.createElement("div");
    // commentElement.classList.add("comment-list");
    // commentElement.innerHTML = `
    //     <span class="comment-user">${user.nickname}</span>
    //     <span class="comment-text">${commentInput.innerText}</span>
    //     <span class="comment-time">${newComment.createdAt}</spam>
    //   `;
    // commentsContainer.append(commentElement);
  } catch {
    console.log("댓글작성에 실패했습니다");
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    const post = comment.post;
    await Comment.deleteOne({ _id: id });
    return res.status(200).redirect(`/posts/${post}`);
  } catch (error) {
    console.log(error);
  }
};

const clickThumb = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    post.like += 1;
    post.save();
    res.status(200).redirect(`/posts/${id}`);
  } catch (error) {
    console.log(error);
  }
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
  addComment,
  deleteComment,
  clickThumb,
};

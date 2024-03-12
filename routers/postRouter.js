const express = require("express");

const {
  getPosts,
  getPost,
  getMakePost,
  postMakePost,
  deletePost,
  postUpdatePost,
  getUpdatePost,
} = require("../controllers/postController");

const postRouter = express.Router();

postRouter.route("/").get(getPosts);

postRouter.route("/:id([0-9a-f]{24})").get(getPost);

postRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(getUpdatePost)
  .post(postUpdatePost);

postRouter.get("/:id([0-9a-f]{24})/delete", deletePost);

postRouter.route("/makePost").get(getMakePost).post(postMakePost);

module.exports = postRouter;

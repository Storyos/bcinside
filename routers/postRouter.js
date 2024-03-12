const express = require("express");

const {
  getPosts,
  getPost,
  getMakePost,
  postMakePost,
} = require("../controllers/postController");

const postRouter = express.Router();

postRouter.route("/").get(getPosts);

postRouter.route("/:id").get(getPost).post();

postRouter.route("/makePost").get(getMakePost).post(postMakePost);

module.exports = { postRouter };

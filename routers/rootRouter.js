const express = require("express");

const { getIndex } = require("../controllers/postController");

const rootRouter = express.Router();

rootRouter.route("/").get(getIndex);

module.exports = rootRouter;

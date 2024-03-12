const express = require("express");

const {} = require("../controllers/postController");

const rootRouter = express.Router();

rootRouter.route("/").get((req, res) => {
  res.send("home");
});

module.exports = rootRouter;

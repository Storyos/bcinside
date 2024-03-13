const express = require("express");

const {} = require("../controllers/postController");

const rootRouter = express.Router();

rootRouter.route("/").get((req, res) => {
  res.status(400).render("index");
});

module.exports = rootRouter;

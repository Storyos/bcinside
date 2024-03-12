const Post = require("../models/Post");
const likeBtn = document.querySelector(".like-btn");

const pushLike = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    post.like += 1;
    post.save();
  } catch (error) {
    alert("좋아요에 실패했습니다");
  }
};

likeBtn.addEventListener("click", pushLike);

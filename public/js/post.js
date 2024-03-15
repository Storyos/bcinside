console.log("hi");

const Post = require("../../models/Post");
const likeBtn = document.querySelector(".like-btn");
const postTime = document.querySelectorAll(".posts_time");

console.log("hi");

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
console.log("hi");

const formattedDate = (date) => {
  const d = date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

likeBtn.addEventListener("click", pushLike);

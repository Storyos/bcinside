const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

const commentsContainer = document.querySelector(".comments-container");
const commentInput = document.querySelector(".comment-input");
const commentBtn = document.querySelector(".comment-btn");
const commentText = document.querySelector(".comment-text");
const replyInput = document.querySelector(".reply-input");
const replyBtn = document.querySelector(".reply-btn");
const commentLists = document.querySelectorAll(".comment-list");

const addComment = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;

  const post = await Post.findById(id).populate("Comment");
  const user = await User.findById(_id);
  if (!post || !user) return alert("댓글작성에 실패했습니다");
  // 게시글 or 유저 정보 확인 실패

  try {
    const text = commentInput.innerText;
    const newComment = await Comment.create({
      user: _id,
      text,
      post: id,
      isReply: false,
    });
    post.comments.push(newComment._id);
    post.save();

    const commentElement = document.createElement("div");
    commentElement.classList.add("comment-list");
    commentElement.innerHTML = `
        <span class="comment-user">${user.nickname}</span>
        <span class="comment-text">${commentInput.innerText}</span>
        <span class="comment-time">${newComment.createdAt}</spam>
      `;
    commentsContainer.append(commentElement);
  } catch {
    alert("댓글작성에 실패했습니다");
  }
};

const addReply = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const post = await Post.findById(id);
  const user = await User.findById(_id);
  if (!post || !user) return alert("댓글작성에 실패했습니다");
  // 게시글 or 유저 정보 확인 실패

  // reply를 작성할 parent comment
  // comment id에서 comment_ 부분 자르기

  try {
    const parentComment = commentText.parentNode;
    const parentId = mongoose.Types.ObjectId(
      parentComment.getAttribute("id").substring(8)
    );
    const text = replyInput.innerText;
    const newComment = await Comment.create({
      user: _id,
      text,
      comment: parentId,
      post: id,
      isReply: true,
    });
    post.comments.push(newComment._id);
    post.save();

    const replyElement = document.createElement("div");
    replyElement.classList.add("reply-list");
    replyElement.innerHTML = `
        <span class="comment-user">${user.nickname}</span>
        <span class="comment-text">${commentInput.innerText}</span>
        <span class="comment-time">${newComment.createdAt}</spam>
      `;
    parentComment.after(replyElement);
  } catch {
    alert("댓글작성에 실패했습니다");
  }
};

commentBtn.addEventListener("click", addComment);
replyBtn.addEventListener("click", addReply);
commentLists.forEach((commentList) => {
  commentList.addEventListener("click");
});

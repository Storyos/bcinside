const express = require("express");
const checkLogin = require("../middlewares/checkLogin");
const userRouter = express.Router();
const {
    googleLogin,
    googleredirect,
    loginUser,
    getLogin,
    getRegister,
    registerUser,
    deleteUser,
    getUserInfo,
    updateUserInfo,
    logout,
    getBlockedUser,
    myPosts,
    myReplies,
    mylikes,
} = require("../controllers/userController");


userRouter.route("/login")
    .post(loginUser)
    .get(getLogin);

userRouter.route("/googleLogin")
    .get(googleLogin)

userRouter.route("/googleLogin/redirect")
    .get(googleredirect);

userRouter.route("/signUp")
    .get(getRegister)
    .post(registerUser);

userRouter.route("/userInfo")
    .get(getUserInfo)
    .patch(checkLogin, updateUserInfo)
    .delete(deleteUser);

userRouter.route("/block_user")
    .get(getBlockedUser);

userRouter.route("/logout")
    .get(logout);

userRouter.route("/myPosts")
    .get(myPosts);

userRouter.route("/myReplies")
    .get(myReplies);

userRouter.route("/mylikes")
    .get(mylikes);

module.exports = userRouter;
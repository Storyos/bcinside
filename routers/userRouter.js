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
    .patch(checkLogin,updateUserInfo)
    .delete(deleteUser);

userRouter.route("/logout")
    .get(logout);

module.exports= userRouter;
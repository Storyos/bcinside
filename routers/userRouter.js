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
    test
} = require("../controllers/userController");


userRouter.route("/login")
    .post(loginUser)
    .get(getLogin);

userRouter.route("/googleLogin")
    .get(googleLogin)

userRouter.route("/googleLogin/redirect")
    .get(googleredirect);

userRouter.route("/register")
    .get(getRegister)
    .post(registerUser);

userRouter.route("/userInfo")
    .get(checkLogin,getUserInfo)
    .patch(checkLogin,updateUserInfo)
    .delete(checkLogin,deleteUser);

userRouter.route("/logout")
    .get(logout);

module.exports= userRouter;
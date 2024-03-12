const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/checkLogin");
const {
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

const userRouter = express.Router();

userRouter.route("/test")
.get(test);

userRouter.route("/login")
    .post(loginUser)
    .get(getLogin);

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
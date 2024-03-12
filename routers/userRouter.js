const express = require("express");

const {
    loginUser,
    getLogin,
    getRegister,
    registerUser,
    deleteUser,
    getUserInfo,
    updateUserInfo,
    logout
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.route("/login")
    .post(loginUser)
    .get(getLogin);

userRouter.route("/register")
    .get(getRegister)
    .post(registerUser);

userRouter.route("/userInfo")
    .get(getUserInfo)
    .patch(updateUserInfo)
    .delete(deleteUser);

userRouter.route("/logout")
    .get(logout);
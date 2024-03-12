const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt")
const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const router = express.Router();



const getLogin = (req, res) => {
    res.render("home");
}

// @desc Login User
// @route POST (뭘로 할까)
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: "일치하는 사용자가 없습니다." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    const token = jwt.sign({ id: user.id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/contacts");
})


// @desc Get Register Page
// @route Get /register
const getRegister = (req, res) => {
    res.render("register");
}


// @desc Register User
// @route Post /register
const registerUser = asyncHandler(async (req, res) => {
    const { username, password, nickname } = req.body;
    // ID 중복검사 Logic
    const users = await User.findOne({ username });
    if (users) {
        res.send("이미 존재하는 회원아이디입니다.")
    }

    // Password 조건검사 Logic
    if (password.length > 12) {
        res.send("비밀번호 너무 김")
    } else if (password.length < 8) {
        res.send("비밀번호 너무 짧음");
    }
    else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, nickname });


        // 회원가입까지는 가능 --> 이후 처리 필요
        res.status(201).json({ message: "등록성공", user })
    }
});

// @desc Delete User (회원 탈퇴)
const deleteUser = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const id = decoded.id;
        await User.findByIdAndDelete(id);
    } catch (err) {

    }
    res.clearCookie("token");
    res.redirect("/");
    // DB에서 cookie ID 삭제
    // Redirect로 Logout 처리
})

// @desc MyPage
// @route get /userInfo
const getUserInfo = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    const userInfo = await User.findById(req.user.id); 
    res.render("userPage", { user: userInfo });
});


// @desc 회원정보수정
// @route put /userInfo
const updateUserInfo = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const { username, nickname } = req.body; // 수정
    await User.findByIdAndUpdate(id, { username, nickname }); // 수정
    res.send("회원정보 Update완료");
});

// @desc logout
// @route get /logout
const logout = asyncHandler((req, res) => {
    res.clearCookie("token");
    res.redirect("/");
})

const test = (req, res) => {
    res.redirect("https://www.naver.com");
}
module.exports = {
    loginUser,
    getLogin,
    getRegister,
    registerUser,
    deleteUser,
    getUserInfo,
    updateUserInfo,
    logout,
    test
};
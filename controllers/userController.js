const asyncHandler = require("express-async-handler");
const User = require("../models/User");
// const bcrypt = require("bcrypt")
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = preocess.env.JWT_SECRET;

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
    const users = await User.findMany({ username });
    if (users.includes(username)) {
        console.alert("이미 존재하는 ID입니다.");
    }

    // Password 조건검사 Logic
    if (password.length > 12) {
        console.alert("비밀번호가 너무 깁니다.")
    } else if (password.length < 8) {
        console.alert("비밀번호가 너무 짧습니다.");
    }
    else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, nickname });
        // res.redirect("/")
        res.status(201).json({ message: "등록성공", user })
    }
});

// @desc Delete User (회원 탈퇴)
const deleteUser = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    try{
        const decoded = jwt.verify(token, jwtSecret);
        const id = decoded.id;
        await User.findByIdAndDelete(id);
    }catch (err){
        
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
    if (!token) {
        return res.redirect("/");
    } try {
        const decoded = jwt.verify(token, jwtSecret);
        const userInfo = await User.findOne(decoded.id);

        res.render("userPage",{user : userInfo});

    } catch (err) {
        // 에러처리
        res.status(401).json({ message: "에러" })
    }
    // 세션값에서 userID를 받아서 그 아이디로 필드를 찾아서 반환
})

// @desc 회원정보수정
// @route put /userInfo
const updateUserInfo = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    try{
        const decoded = jwt.verify(token,jwtSecret);
    } catch(err){

    }

    const id = decoded.id;
    const { username, nickname } = req.body;
    const user = await User.findByIdAndUpdate(id);

    user.username = username;
    user.nickname = nickname;
    // 응답필요
    res.send("회원정보 Update완료");
})

// @desc logout
// @route get /logout
const logout = asyncHandler((req, res) => {
    res.clearCookie("token");
    res.redirect("/");
})
module.exports = {
    loginUser,
    getLogin,
    getRegister,
    registerUser,
    deleteUser,
    getUserInfo,
    updateUserInfo,
    logout
};
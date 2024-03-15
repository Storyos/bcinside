const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt")
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_CLIENT_ID = "757443114508-8fjkol869pqnhsmubv2jvehdemiib3r0.apps.googleusercontent.com";
const axios = require('axios');


const getLogin = (req, res) => {
    res.render("login");
}

// @desc Login User
// @route POST (뭘로 할까)
const loginUser = asyncHandler(async (req, res) => {
    const { ID, password } = req.body;
    console.log('username :>> ', ID);
    console.log('password :>> ', password);
    const user = await User.findOne({ username: ID });
    if (!user) {
        return res.status(401).json({ message: "일치하는 사용자가 없습니다." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    const token = jwt.sign({ id: user.id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
})


// @desc Get Register Page
// @route Get /signUp
const getRegister = (req, res) => {
    res.render("register");
}


// @desc Register User
// @route Post /signUp
const registerUser = asyncHandler(async (req, res) => {
    const { username, password, nickname } = req.body;
    // ID 중복검사 Logic
    console.log('username :>> ', username);
    const users = await User.findOne({username:username });
    if (users) {
        return res.send("이미 존재하는 회원아이디입니다.")
    }
    // Password 조건검사 Logic
    console.log('password :>> ', password);
    if (password.length > 12) {
        return res.send("비밀번호 너무 김")
    } else if (password.length < 8) {
        return res.send("비밀번호 너무 짧음");
    }
    else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username: username, password: hashedPassword, nickname: nickname });
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
        return res.status(401).json({ message: "토큰 오류" });
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
    const decoded = jwt.verify(token, jwtSecret);
    const id = decoded.id;
    const userInfo = await User.findById(id);
    console.log('userInfo :>> ', userInfo);
    if (!userInfo) {
        res.send("사용자 정보가 없습니다.");
        // res.status(401).json({ message: "사용자 정보가 없습니다." });
    }
    // 경로 설정 필요
    console.log('userInfo.nickname :>> ', userInfo.nickname);
    res.render("account", { user: userInfo });
});


// @desc 회원정보수정
// @route put /userInfo
const updateUserInfo = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const { username, nickname } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser.id !== id) {
        return res.send("이미 존재하는 사용자 이름입니다.");
    }
    await User.findByIdAndUpdate(id, { username, nickname });
    const updatedUser = await User.findById(id);
    res.json({ message: "회원정보가 업데이트되었습니다.", user: updatedUser });
});
const test = (req, res) => {
    res.redirect("https://www.naver.com");
}

// @desc logout
// @route get /logout
const logout = asyncHandler((req, res) => {
    res.clearCookie("token");
    res.redirect("/");
})

const getBlockedUser = asyncHandler(async(req,res)=>{
    const token = req.cookies.token;
    const decoded = jwt.verify(token,jwtSecret);
    const id = decoded.id;
    const user = await User.findById(id);
    const blockedUsers = await User.find({_id:user.blocked});
    if(blockedUsers===null){
        res.status(401).json({message:"Theres is NO blocked User"});
    }
    res.render("block_user",{blockedUsers:blockedUsers});
});

// Google OAUTH 관련 
// 
// 
const GOOGLE_REDIRECT_URI = "http://localhost:3000/users/googleLogin/redirect";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

// 구글 토큰으로 email, google id 등을 가져오기 위한 url
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

const googleLogin = (req, res) => {
    let url = "https://accounts.google.com/o/oauth2/v2/auth";
    url += `?client_id=${GOOGLE_CLIENT_ID}`;
    url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`;
    url += '&response_type=code';
    url += '&scope=email profile';
    res.redirect(url);
};

const googleredirect = asyncHandler(async (req, res) => {
    const { code } = req.query;
    console.log('code :>> ', code);

    const resp = await axios.post(GOOGLE_TOKEN_URL, {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
    });

    // 토큰으로 google 계정 정보 가져오기
    const resp2 = await axios.get(GOOGLE_USERINFO_URL, {
        // Request Header에 Authorization 추가
        headers: {
            Authorization: `Bearer ${resp.data.access_token}`,
        },
    });

    let user = await User.findOne({ username: resp2.data.id });
    if (!user) {
        // Google 정보를 사용하여 새 사용자 생성
        user = await User.create({
            username: resp2.data.id,
            nickname: resp2.data.name,
            password: resp2.data.id
        });
    }
    const token = jwt.sign({ id: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    // DATA와 함께 넘겨줘야함
    res.redirect("/");
});







module.exports = {
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
};
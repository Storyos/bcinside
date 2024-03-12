const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt")
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = preocess.env.JWT_SECRET;

const getLogin = (req,res)=>{
    res.render("home");
}

// @desc Login User
// @route POST (뭘로 할까)
const loginUser = asyncHandler(async(req,res)=>{
    const {username,password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.status(401).json({message:"일치하는 사용자가 없습니다."});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({message:"비밀번호가 일치하지 않습니다."});
    }
    const token = jwt.sign({id:user._id},jwtSecret);
    res.cookie("token",token,{httpOnly:true});
    res.redirect("/contacts");
})


// @desc Get Register Page
// @route Get /register
const getRegister = (req,res)=>{
    res.render("register");
}


// @desc Register User
// @route Post /register
const registerUser = asyncHandler(async (req,res)=>{
    const {username,password,nickname} = req.body;
    // ID 중복검사 Logic
    const users = await User.findMany({ username });
    if (users.includes(username)) {
        console.alert("이미 존재하는 ID입니다.");
    }

    // Password 조건검사 Logic
    if(password.length>12){
        console.alert("비밀번호가 너무 깁니다.")
    }else if(password.length<8){
        console.alert("비밀번호가 너무 짧습니다.");
    }
    else    {
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({username,password:hashedPassword,nickname});
        res.status(201).json({message:"등록성공",user})
        res.send("register Failed");
    }
});

// @desc Delete User (회원 탈퇴)
const deleteUser = (req,res)=>{
    const id = req.params.id;
    // DB에서 cookie ID 삭제
    // Redirect로 Logout 처리
}

const getUserInfo = asyncHandler(async(req,res)=>{
    // 세션값에서 userID를 받아서 그 아이디로 필드를 찾아서 반환
})

const updateUserInfo = asyncHandler(async (req,res)=>{
    const id = req.params.id;
    const {name,nickname} = req.body;

})
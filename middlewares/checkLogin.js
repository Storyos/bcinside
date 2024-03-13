require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// next : 이후 동작을 위해 넣는것
// CacheControl을 설정하는 코드
// no-cache : 캐시 사용 X
// no-store : 서버의 응답을 캐시에 저장X
// must-revalidate : 캐시에 있는 정보를 사용하더라도 서버에 반드시 확인
const checkLogin = async(req,res,next)=>{
    res.setHeader("Cache-Control","no-cache,no-store,must-revalidate");
    
    const token = req.cookies.token;
    if(!token){
        return res.redirect("/");
    } try{
        const decoded = jwt.verify(token,jwtSecret);
        req.user = decoded;
        next();
    } catch(err){
        return res.status(401).json({message:"로그인이 필요합니다."});
    }
}

module.exports = checkLogin;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        // 토큰이 유효하지 않을 경우
        res.locals.isLoggedIn = false;
        res.locals.user = "guest";
      } else {
        // 토큰이 유효한 경우
        res.locals.isLoggedIn = true;
        res.locals.user = decoded.id;
      }
    });
  } else {
    // 토큰이 없는 경우
    res.locals.isLoggedIn = false;
    res.locals.user = "guest";
  }

  next();
};
module.exports = isLoggedIn;

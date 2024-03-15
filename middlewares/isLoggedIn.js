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
      } else {
        // 토큰이 유효한 경우
        res.locals.isLoggedIn = true;
      }
    });
  } else {
    // 토큰이 없는 경우
    res.locals.isLoggedIn = false;
  }

  next();
};
module.exports = isLoggedIn;

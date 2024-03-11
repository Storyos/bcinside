const express = require("express");
const MethodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const { postRouter } = require("./routers/postRouter");

const app = express();
const port = 3000;
const dayTime = 1000 * 3600 * 24;
dbConnect();

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/views");

//app.use(express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(MethodOverride("_method"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({ mongoUrl: process.env.DB_URL }),
    cookie: { maxAge: dayTime },
  })
);

app.use;

app.listen(port, () => {
  console.log(`${port}번 포트에서 서버 실행 중 🚀`);
});

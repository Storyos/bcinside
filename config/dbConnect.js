const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL);
    console.log("DB is connected ✅");
  } catch (error) {
    console.log(error);
  }
};
module.exports = dbConnect;

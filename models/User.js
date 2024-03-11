const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
    },
    hpassword:{
        type:String,
        required:true,   
    },
    nickname:{
        type:String,
        required:true,
    },
    

})
const mongoose = require("mongoose");

const AccountSchema = mongoose.Schema({
    accountnumber : {
        type: String,
        required : true,
        unique : true,
    },
    bankname : {
        type : String,
        required : true,
        
    }
})
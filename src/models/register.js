
const mongoose=require("mongoose");

// schema
const entries=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        min:3
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    rePass:{
        type:String,
        required:true,
        min:6
    }
})

// collection
const Register=new mongoose.model("register",entries);
module.exports=Register;
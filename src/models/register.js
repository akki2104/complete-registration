
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken");
// schema
const entries = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        min: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    rePass: {
        type: String,
        required: true,
        min: 6
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

// middleware for generating tokens
entries.methods.genAuthToken=async function(){
    try {
        const token =jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        console.log(`the token gen is (i m register.js) ${token}`);
        return token;
        
    } catch (e) {
        
        console.log(`the error is ${e}`);
    }
}


// middleware for hashing password
entries.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password=await bcrypt.hash(this.password,10);
        this.rePass=await bcrypt.hash(this.password,10);
        // this.rePass=undefined;
        next();
    }
})


// collection
const Register = new mongoose.model("register", entries);
module.exports = Register;
const jwt = require("jsonwebtoken");
const Register= require("../models/register")
require("cookie-parser");


const auth=async(req,res,next)=>{
    try {
        const token = req.cookies.jwtlog;
        const verifyUser= await jwt.verify(token,process.env.SECRET_KEY);
        const user=await Register.findOne({_id:verifyUser._id});
        console.log(user.userName);
        console.log(verifyUser);

        req.user=user;
        req.token=token;

        next();
    } catch (e) {
        console.log(e);
        res.status(400).render("dumbSecret");
    }
}

module.exports=auth;
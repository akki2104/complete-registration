require('dotenv').config()
const express = require("express");
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const app = express();
const Register = require("./models/register");
const exp = require("constants");
const bcrypt = require("bcryptjs");
const cookieParser=require("cookie-parser");
const auth=require("./middleware/auth");


// port
const port = process.env.PORT || 8000;

// static files
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
// views
const viewsPath = path.join(__dirname, "../templates/views");
app.set("view engine", "hbs");
app.set("views", viewsPath);

// partials
partialsPath = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partialsPath);


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));



app.get("/", (req, res) => {
    res.render("index");
})

// secret page
app.get("/secret",auth,(req,res)=>{
    console.log(`this is the secret cookie ${req.cookies.jwtlog}`);
    res.render("secret");
})
// logout from single func
app.get("/logout",auth,async(req,res)=>{
    try {

        req.user.tokens=req.user.tokens.filter((currEle)=>{
            return currEle.token!== req.token;
        })


        res.clearCookie("jwtlog");

        console.log("logged out from this device suxessfully...");
        await req.user.save();
        res.render("login"); 

    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
})
// logout from devices 
app.get("/complogout",auth,async(req,res)=>{
    try {

        // req.user.tokens=req.user.tokens.filter((currEle)=>{
        //     return currEle.token!== req.token;
        // })

        req.user.tokens=[];
        res.clearCookie("jwtlog");

        console.log("logged out from all devices suxessfully...");
        await req.user.save();
        res.render("login"); 

    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
})
// Read login page
app.get("/register", (req, res) => {
    res.render("login");
})
// Crete new user 
app.post("/register", async (req, res) => {
    try {
        const uName = req.body.userName;
        const mail = req.body.email;
        const pass = req.body.password;
        const rePasss = req.body.rePass;
        if (rePasss === pass) {
            const newUser = new Register({
                userName: uName,
                email: mail,
                password: pass,
                rePass: rePasss
            })

            // middleware bcryptJS
            const tokenreg = await newUser.genAuthToken();  //middleware for generating token 
            console.log(`the token generated is(i m app.js/registration) ${tokenreg}`);


            //storing cookies
            res.cookie("jwtreg", tokenreg, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            })

            const registered = await newUser.save();
            res.status(201).render("login");
        } else {
            res.send("passwords not matching");
        }
        // console.log(uName);
        // console.log(mail);
        // console.log(pass);
        // console.log(rePass);



    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
})
// read existing user
app.post("/login", async (req, res) => {
    try {
        const mail = req.body.logmail;
        const pass = req.body.logpass;
        const doesExists = await Register.findOne({ email: mail });
        const yespass = doesExists.password;
        if (doesExists) {
            const isMatch = await bcrypt.compare(pass, yespass);//comparing  pass

            const tokenlog = await doesExists.genAuthToken();  //middleware for generating token during login
            console.log(`the token generated is(i m app.js/login) ${tokenlog.toString()}`);

            res.cookie("jwtlog", tokenlog, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            })

            
            


            if (isMatch) {
                res.status(200).send("bss itna hee tha ..khush ho jao");
            } else {
                res.status(500).send("invalid login...try again!!");
            }
        } else {
            res.status(500).send("phle register to krle bhai...!!");
        }
    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
})


// listening
app.listen(port, () => {
    console.log(`listening at port ${port}`);
})
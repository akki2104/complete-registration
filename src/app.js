const express = require("express");
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const app = express();
const Register = require("./models/register");
const exp = require("constants");


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
app.use(express.urlencoded({ extended: false }));



app.get("/", (req, res) => {
    res.render("index");
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
        if (pass === rePasss) {
            const newUser = new Register({
                userName: uName,
                email: mail,
                password: pass,
                rePass: rePasss
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
    }
})
// read existing user
app.post("/login", async (req, res) => {
    try {
        const mail = req.body.logmail;
        const pass = req.body.logpass;
        const doesExists=await Register.findOne({email:mail});
        if(doesExists)
        {
            if(doesExists.password===pass)
            {
                res.status(200).send("bss itna hee tha ..khush ho jao");
            }else{
                res.status(500).send("invalid login...try again!!");
            }
        }else{
            res.status(500).send("phle register to krle bhai...!!");
        }
    } catch (e) {
        res.status(400).send(e);
    }
})


// listening
app.listen(port, () => {
    console.log(`listening at port ${port}`);
})
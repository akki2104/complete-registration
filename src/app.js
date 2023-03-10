const express=require("express");
const path=require("path");
const hbs=require("hbs");
require("./db/conn");
const app=express();


// port
const port= process.env.PORT || 8000;

// static files
const publicPath=path.join(__dirname,"../public");
app.use(express.static(publicPath));
// views
const viewsPath=path.join(__dirname,"../templates/views");
app.set("view engine","hbs");
app.set("views",viewsPath);
// partials
partialsPath=path.join(__dirname,"../templates/partials");
hbs.registerPartials(partialsPath);






app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/register",(req,res)=>{
    res.render("login");
})




// listening
app.listen(port,()=>{
    console.log(`listening at port ${port}`);
})

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
    }
})

entries.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password=await bcrypt.hash(this.password,10);
        this.rePass=undefined;
        next();
    }
})


// collection
const Register = new mongoose.model("register", entries);
module.exports = Register;
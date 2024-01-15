import mongoose from "mongoose";

const adminschema= new mongoose.Schema({
    username: String,
    password: String,
    created_problems: [{type: mongoose.Schema.Types.ObjectId, ref: "Problem"}]
})
const userschema= new mongoose.Schema({
    username: String,
    password: String,
    submissions: [{ id : {type: mongoose.Schema.Types.ObjectId, ref: "Problem"},
                    accepted : Boolean
                }],
    score: Number
})
const problemschema= new mongoose.Schema({
    title: String,
    ps: String,
    answer: Number,
    points: Number
})

const User = mongoose.model("User", userschema);
const Admin = mongoose.model("Admin", adminschema);
const Problem = mongoose.model("Problem", problemschema);

export {User,Admin,Problem}
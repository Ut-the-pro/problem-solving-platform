import express, { application } from "express";
import jwt from "jsonwebtoken";
import {Admin, Problem} from "../database";

const router = express.Router()

router.post("/login", async (req, res)=>{
    const {username, password} = req.body;
    const admin = await Admin.findOne({username, password})
    if (!admin){
        res.status(401).json({message: "Incorrect username or password"})
    }
    else
    {
        const token = jwt.sign({username}, `${process.env.ADMIN_SECRET}`, {expiresIn: "1h"})
        res.status(200).json({message: "Admin logged in successfully", token})
    }
})

router.use("/", async (req, res, next)=>{
    const auth = req.headers.Authorization as string[] | undefined;
    if(auth !== undefined){
        const token = auth[1];
        try{
            const {username} = jwt.verify(token, `${process.env.ADMIN_SECRET}`) as {username: string};
            //@ts-ignore
            req.admin = username;
            next();
        }  
        catch (err) {
            res.json({message: 'Invalid Admin'})
        }  
    }
    else
        res.status(403).json({message: "Invalid Admin"})
})

router.post("/create", async (req, res)=>{
    const problem = req.body;
    const search = Problem.findOne(problem);
    if (!search){
        await new Problem(problem).save();
        //@ts-ignore
        const admin = await Admin.findOne({username: req.admin});
        if(admin !== null){
            admin.created_problems.push(problem)
            await admin.save();
        }
        res.json({message: "Problem createed successfully"})
    }
    else
        res.json({message: "Problem already exists"})
})

router.get("/myproblems", async (req, res)=>{
    //@ts-ignore
    const admin = await Admin.findOne({username: req.admin});
    if(admin !== null){
        admin.populate("created_problems")
        res.json({"courses": admin.created_problems || []})
    }
})


export default router;
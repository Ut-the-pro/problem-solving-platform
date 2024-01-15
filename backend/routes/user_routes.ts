import express from "express";
import jwt from "jsonwebtoken"
import {z} from "zod";
import {User, Problem} from "../database"

const router = express.Router()

const emailInput = z.string().email();
const passwordInput = z.string().min(6);

router.post("/signup", async (req, res)=>{
    const parsedEmail = emailInput.safeParse(req.body.username);
    const parsedPassword = passwordInput.safeParse(req.body.password);

    if(!parsedEmail.success || !parsedPassword.success){
        res.status(411).json({message: "Invalid email or password"})
    }
    else{
        const username = parsedEmail.data;
        const search = User.findOne({username});
        if(!search){
            const password = parsedPassword.data;
            await new User({username, password, submissions: {solved: [], unsolved: []}}).save();
            res.json({message: "User created successfully"})
        }
        else
            res.json({message: "User already exists"})
    }
})

router.use("/", async (req, res, next)=>{
    const auth = req.headers.Authorization as string[] | undefined;
    if(auth !== undefined){
        const token = auth[1];
        try{
            const {username} = jwt.verify(token, `${process.env.ADMIN_SECRET}`) as {username: string};
            //@ts-ignore
            req.user = username;
            next();
        }  
        catch (err) {
            res.json({message: 'Invalid Admin'})
        }  
    }
    else
        res.status(403).json({message: "Invalid Admin"})
})

router.get("/problems", async (req, res) => {
    const problems = await Problem.find();
    res.json({problems});
});
  
router.get("/problem/:problemId", async (req, res) => {
    const id = req.params.problemId;
    const problem = await Problem.findOne({ _id : id});
    if (!problem) {
      return res.status(411).json({});
    }
    res.json({problem});
});
  
router.get("/submissions/:problemId", async (req, res) => {
    //@ts-ignore
    const user = await User.findOne({username : req.user } );
    const problemId = req.params.problemId;
    //@ts-ignore
    const submissions = user.submissions.filter({id : problemId})
    res.json({submissions});
});
  
router.post("/problem/:problemId",  async (req, res) => {
    const id = req.body.problemId;
    const submission = req.body.submission;
    const problem = await Problem.findOne({_id: id})
    //@ts-ignore
    const user = await User.findOne({username : req.user } );

    if(!problem){
        res.status(403)
    }
    else{
        let accepted =  (submission == problem.answer)
        //@ts-ignore
        user.submissions.push({id, accepted})
        if(accepted)
        //@ts-ignore
            user.score += problem.points;
    } 
})

export default router;
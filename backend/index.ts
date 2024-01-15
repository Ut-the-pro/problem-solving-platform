import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import adminRouter from "./routes/admin_routes";
import userRouter from "./routes/user_routes";

const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(`${process.env.MONGO_URL}`, {dbName: "psp"})

app.use("/admin", adminRouter);
app.use("/user", userRouter);


app.listen(port);
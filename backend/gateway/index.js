import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
const port =process.env.PORT

const app=express()
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(morgan("dev"))
app.use(cookieParser())

app.use(router);

app.get("/",(req,res)=>{
    res.json({message:"hello from gateway v5"})
})

app.listen(port,()=>{
    console.log(`gateway started at ${port}`)
})

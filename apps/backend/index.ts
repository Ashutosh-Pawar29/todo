import { prisma } from "@repo/db";
import { type createtodo, type detetetodo, type signup, type updatetodo } from "commons";
import bcrypt from "bcrypt";
import cors from "cors";
import express, { type NextFunction,type Request, type Response } from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || process.env.port || 3000;
const pass:string = process.env.JWTSECRET || "secret";

function authenticate(req:Request,res:Response,next:NextFunction){
    let token:string = req.headers.token as string 
    token = token.split(" ")[1] || ""
    const valid = jwt.verify(token,pass)
    console.log(valid)
    if(valid){
        req.body = {...req.body,userid:valid}
        next()
    }
    else{
        res.json({msg:"invalid token sent please login again"})
        return
    }
}

app.post("/signup", async (req, res) => {
  const body: signup = req.body;
  
  const user = await prisma.users.findUnique({
    where : {
      username: body.username,
    },
  });
  
  if (user) {
    return res.status(409).json({
      message: "Username already exists",
    });
  }
  const hashedPass = await bcrypt.hash(body.password,5)
  const newUser = await prisma.users.create({
    data: {
      username: body.username,
      password: hashedPass,
    },
  });

  const token = jwt.sign(newUser.id,pass)

  return res.status(201).json({
    message: "User created successfully",
    token: token
  });
});

app.post('/signin',async (req,res)=>{
    const body:signup = req.body
    const user = await prisma.users.findUnique({where:{username:body.username}})
    if(!user){
        res.json({msg:"invalid username"})
        return
    }
    const valid = await bcrypt.compare(body.password,user.password)
    if(!valid){
        res.json({msg:"invalid password"})
        return
    }
    else{
        const token = jwt.sign(user.id,pass)
        res.json({msg:"signin successfully ",token})
    }
})

app.post('/todo',authenticate,async (req,res)=>{
    const body:createtodo = req.body
    let todo =await prisma.todos.create({data:body})
    res.json({msg:"todo created",todo})
})

app.get('/todo',authenticate,async (req,res)=>{
    const todos = await prisma.todos.findMany({where:{userid:req.body.userid}})
    console.log(todos)
    res.json({todos:todos})
})

app.put('/todo',authenticate,async (req,res)=>{
    const body:updatetodo = req.body
    const todo = await prisma.todos.update({
        where:{id:body.id,userid:body.userid},
        data:body
    })
    res.json({msg:"todo updated",todo})
})

app.delete('/todo',authenticate,async (req,res)=>{
    const body:detetetodo = req.body
    const todo = await prisma.todos.delete({where:body})
    res.json({msg:"todo deleted",todo})
})

app.put('/MarkAsDone',authenticate,async (req,res)=>{
    const body:detetetodo = req.body
    const todo = await prisma.todos.update({where:{id:body.id,userid:body.userid},data:{done:body.done}})
    res.json({msg:"todo completed ",todo})
})

app.listen(port,()=>{console.log(`server listening on ${port}`)})
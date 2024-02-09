const express = require("express");
const fs=require("fs");
const mongoose = require("mongoose");
const users = require("./MOCK_DATA.json");
const app=express();
const PORT=8000;


mongoose
.connect("mongodb://127.0.0.0:27017/backend-app")
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log('Mongo errpr',err));




const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    jobTitle:{
        type:String,

    },
    gender:{
      type:String,  
    },

},
{timestamps:true});
const User=mongoose.model("user",userSchema);

//middleware plugin
app.use(express.urlencoded({extended:false}));
app.use((req,res,next)=>{
fs.appendFile(
    "log.txt",
    `\n${Date.now()}:${req.ip} ${req.method}:${req.path}\n`,
    (err,data)=>{
        next();
    }
);
 //used to end res( return res.json({mgs:"hello from middleware"});)
 //for next function to be called next()

});
app.get("/users",async(req,res)=>{
    /**
     * 
     * 
     */
    const allDbUsers= await User.find({});
    const html =`
    <ul>
    ${users.map(user =>`<li>${user.firstName} - ${user.email} </li>`).join("")}
    </ul>
    `;
    res.send(html);
});
//defining routes
app.get("/api/users",(req,res)=>{
    res.setHeader("X-MyName","Piyush Garg");
    return res.json(users);
});

app.get("/api/users/:id",(req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
});
app.post("/api/users",(req,res)=>{
  const body= req.body;
   users.push({...body,id:users.length+1});
   fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
    return res.json({status:"pending"});
   });
  
});
 
app.patch('/api/users/:id',(req,res) =>{
    //Edit the user with id 
    return res.json ({status:"pending"});
});
app.delete('/api/users/:id',(req,res) =>{
    //delete the user with id 
    return res.json ({status:"pending"});
});
app.post("/api/users",async(req,res)=>{

    const body =req.body;
    if(
        !body||
        !body.first_name||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.jov_title 
    ){
        return res.status(400).json({mgs:"All fields are req"});
    }
    const result=await User.create({
        firstName:body.first_name,
        lastName:body.last_name,
        email:body.email,
        gender:body.gender,
        jobTitle:body.job_title,

    });

    console.log('result',result);
    return res.status(201).json({msg:"success"});
});

app.listen(PORT,()=>console.log(`server started at :${PORT}`))
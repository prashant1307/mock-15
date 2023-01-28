const express = require('express')
const cors=require("cors")
const { default: mongoose } = require('mongoose')
const UserModel= require('./models/User.model')
const jwt=require("jsonwebtoken")
const PORT =process.env.PORT||8080;

const app = express()
app.use(cors())

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/',(req,res) => res.send('hello'))

app.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;
    const user=new UserModel({name,email,password})
    await user.save()
    res.send("User created successfully")
})

app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    const user=await UserModel.findOne({email,password})
    if(!user){
        return res.send("invalid credential")
    }
    const token=jwt.sign({id:user.id,email:user.email},
        "SECRET123",
        {
            expiresIn:"5 days"
        }
        )
        res.send({message:"login success",token})
})

app.post("/bmi",async(req,res)=>{
    const {height,weight}=req.body;
    
     let bmi=weight/height;

     if(bmi<18.5){
        res.send({BMI:bmi,result:"Underweight"})
     }
    else if(bmi>=18.5 && bmi<=24.9){
        res.send({BMI:bmi,result:"Normal Weight"})
    }
    else if(bmi>=25 && bmi<=29.9){
        res.send({BMI:bmi,result:"Overweight"})
    }
    else if(bmi>=30 && bmi<=34.9){
        res.send({BMI:bmi,result:"Obesity"})
    }
    else if(bmi>=35 && bmi<=39.9){
        res.send({BMI:bmi,result:"Extreme Obesity"})
    }
     //res.send({BMI:bmi})
})

mongoose.connect("mongodb+srv://prashant:qwerty123@cluster0.60vk8lg.mongodb.net/test").then(()=>{
    app.listen(PORT,() => {console.log('server started on port 8080')})
})
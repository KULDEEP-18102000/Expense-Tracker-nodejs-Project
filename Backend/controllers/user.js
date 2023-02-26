const User=require('../models/user')
const bcrypt=require('bcryptjs')

exports.signUp=async(req,res,next)=>{
    // console.log(req.body)
    try {
        const name=req.body.name
    const email=req.body.email
    const password=req.body.password
    const user =await User.findOne({where:{email:email}})
    if(user){
        console.log("User already exists")
        res.json({message:"user already exists"})
    }else{
        bcrypt.hash(password,10,async(err,hash)=>{
            console.log(err)
            await User.create({name:name,email:email,password:hash})
            res.status(201).json({message:"successfully created new user"})
        })
    }
    } catch (error) {
        res.status(500).json(err)
    }
    
    
}

exports.login=async(req,res,next)=>{
    const email=req.body.email
    const password=req.body.password
    const user=await User.findOne({where:{email:email}})
    if(!user){
        res.status(404).json({message:"user not found"})
    }
    else{
        bcrypt.compare(password,user.password,(err,result)=>{
            if(err){
                res.status(500).json({success:false, message:"Something went wrong"})
            }
            if(result===true){
                res.status(200).json({success:true,message:"user login successfull"})
            }else{
                res.status(400).json({success:false,message:"incorrect password"})
            }
        })
    }
    
}
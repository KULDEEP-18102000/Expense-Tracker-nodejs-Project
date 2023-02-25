const User=require('../models/user')

exports.signUp=async(req,res,next)=>{
    // console.log(req.body)
    const name=req.body.name
    const email=req.body.email
    const password=req.body.password
    const user =await User.findOne({email:email})
    if(user){
        console.log("User already exists")
        res.json({"message":"user already exists"})
    }else{
        User.create({name:name,email:email,password:password})
    .then(user=>{
        res.json(user)
    })
    .catch(err=>{
        console.log(err)
    })
    }
    
}
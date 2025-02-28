const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const router = express.Router();

router.post('/register',async(req,res)=>{
    try{
    const{name,email,password}=req.body;
    const hashedpassword=await bcrypt.hash(password,10);
        const user=new User({name,email,password:hashedpassword,subscribedCategories:[]});
        await user.save();
        res.status(201).json({message:"User registered succesfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        });
    }
    catch(error){
        res.status(404).json({message:"Error",error})
    }
})

router.post('/login',async(req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(404).json({ message: "Invalid credentials" })
        }
        const token=jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1h"});
        return res.json({
            message:"Login Successful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            }
        });
    }
    catch(err){
        return res.status(404).json({message:"Server error",err})
    }
})

module.exports=router;
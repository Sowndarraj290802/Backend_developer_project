const express = require('express');
const User = require('../model/User');
const Category=require('../model/Category');
const sendEmail=require('../utils/emailservice');
const authenticate=require('../middleware/authMiddleware');
const router = express.Router();

router.post('/subscribe',authenticate,async(req,res)=>{
    try{
    const{categories}=req.body;
    const user=await User.findById(req.userId);
    if(!user){
        return res.status(404).json({error:"User not Found"});
    }
    const categoryDocs= await Category.find({name:{$in:categories}});
    if(categoryDocs.length===0){
        return res.status(400).json({error:"No valid categories found to subscribe"});
    }
    user.subscribedCategories=categoryDocs.map(cat=>cat._id);
    await user.save();
    await sendEmail(user.email,"Subscription Confirmation",`You subscribed to ${categories.join(",")}`)
    res.json({message:"Subscribed Succesfully",subscribedCategories:categoryDocs.map(cat=>cat.name)});
    }
    catch(error){
        res.status(500).json({ error: "Failed to update subscriptions" });
    }
});

router.post('/unsubscribe',authenticate,async(req,res)=>{
    const {categories}=req.body;
    const user=await User.findById(req.userId);
    if(!user){
        return res.status(404).json({error:"User not Found"});
    }
    user.subscribedCategories=user.subscribedCategories.filter(cat=>!categories.includes(cat.toString()));
    await user.save();
    return res.status(200).json({message:"Unsubscribed Successfully"});
})

module.exports=router;

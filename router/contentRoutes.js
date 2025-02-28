const express = require('express');
const User = require('../model/User');
const authenticate=require('../middleware/authMiddleware');
const axios=require('axios');
const router = express.Router();
router.get('/personalized',authenticate,async(req,res)=>{
    try{
        const user=await User.findById(req.userId).populate("subscribedCategories");

        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        
        if(user.subscribedCategories.length===0){
            return res.status(400).json({message:"No subscribed categories found"});
        }
        const categories=user.subscribedCategories.map(c=>c.name);
        let allArticles=[];
        for(let category of categories){
            try{
                const response=await axios.get(`https://newsapi.org/v2/top-headlines?category=${category}&apikey=${process.env.API_KEY}`);
                allArticles=allArticles.concat(response.data.articles);
            }
            catch(error){
                return res.status(404).json({error:"error in request"});
            }
        }
        return res.json({ message: "Personalized News Fetched", articles:allArticles });
    }
    catch(error){
        return res.status(500).json({error:"Internal Server Error"});
    }
})
module.exports=router;
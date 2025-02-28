const jwt=require('jsonwebtoken');
const authenticate=(req,res,next)=>{
    const token=req.header("Authorization");
    if(!token){
        return res.status(404).json({message:"Unauthorized"})
    }
    try{
        const decoded=jwt.verify(token.replace("Bearer ",""),process.env.SECRET_KEY);
        req.userId=decoded.userId;
        next();
    }
    catch{
        res.status(404).json({error:"Invalid token"});
    }
}
module.exports=authenticate;
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const authRoutes=require('./router/authRoutes');
const subscriptionRoutes=require('./router/subscriptionRoutes');
const contentRoutes=require('./router/contentRoutes');
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log("MongoDB Connection Error",err))

app.use('/api', authRoutes);
app.use('/api',subscriptionRoutes);
app.use('/api',contentRoutes);

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})

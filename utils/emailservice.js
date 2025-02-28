const nodemailer=require('nodemailer');
const sendEmail=async(to,subject,text)=>{
    let transporter= nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    });
    let info=await transporter.sendMail({
        from:`"My App" <${process.env.EMAIL_USER}>`,to,subject,text
    });
}
module.exports=sendEmail;
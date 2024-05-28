import express from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

const optStore : Record<string, string> = {};


app.post('/generateOTP', (req, res)=>{
    const email = req.body.email;
    if(!email){
        return res.status(400).json({message: "Email is required"});
    }
    const OTP = Math.floor(10000+Math.random()*900000).toString();
    optStore[email] = OTP;
    console.log(`OTP generated is: ${OTP}`);
    res.status(200).json({message: "The otp is generated and already logged"});
})

app.post('/reset-password', (req,res)=>{
    const { email, otp, password } = req.body;
    if(!email || !otp || !password){
        res.status(400).json({message: "Either email, otp or password is missing"});
    }
    if(optStore[email] === otp){
        console.log(`The password has been reset for ${email}`);
        delete otp[email];
        res.status(200).json({message: "Password reset is successfull"});
    } else {
        res.status(400).json({message: "Invalid OTP"});
    }

});

app.listen(PORT, ()=>{
    console.log(`The server started on port: ${PORT}`)
})
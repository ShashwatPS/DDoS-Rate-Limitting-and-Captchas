import express from 'express'
import rateLimit from 'express-rate-limit'

const app = express()
const PORT = 3000

app.use(express.json())

const optStore : Record<string, string> = {};

const otpLimiter = rateLimit({
    windowMs: 5*60*1000, // 5 mins
    max: 3, //Limiting each IP to 3 requests per windowMs
    message: "Too many requests try again in 5 mins",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const passwordResetLimiter = rateLimit({
    windowMs: 15*60*1000, // 15 mins
    max: 5, //Limiting each IP to 3 requests per windowMs
    message: "Too many requests try again in 5 mins",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Basically create different limiters and use it as middleware in the endpoint you want to rate limit
// should be always done aggressively for sensitive endpoints.


app.post('/generateOTP',otpLimiter, (req, res)=>{
    const email = req.body.email;
    if(!email){
        return res.status(400).json({message: "Email is required"});
    }
    const OTP = Math.floor(10000+Math.random()*900000).toString();
    optStore[email] = OTP;
    console.log(`OTP generated is: ${OTP}`);
    res.status(200).json({message: "The otp is generated and already logged"});
})

app.post('/reset-password', passwordResetLimiter,(req,res)=>{
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
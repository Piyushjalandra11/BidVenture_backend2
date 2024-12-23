import { Router } from 'express';
import { registerUser } from './controllers';
import { verifySignup } from './controllers';

const router = Router();

// Send OTP for Signup
router.post('/signup', registerUser);
router.get("/hello",()=>{
    console.log("hjhjhjjj");
    
})

// Verify OTP and Signup
router.post('/signup-otp-verify', verifySignup);


// Send OTP for Signup

// router.post('/signin', registerUser);

// Verify OTP and Signup
router.post('/signin-otp-verify', verifySignup);

export default router;

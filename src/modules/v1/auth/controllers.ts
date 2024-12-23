import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { generateOTP } from '../../../helpers/otp';
import OTP from '../../../models/otpModel';
import User from '../../../models/userModel';
import { isOTPExpired } from './service';

// Handle Signup OTP Verification
export const verifySignup = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, name } = req.body;

  try {
    const otpRecord = await OTP.findOne({ where: { email, otp } });

    if (!otpRecord || isOTPExpired(otpRecord.expiresAt)) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    const existingUser = await User.findOne({ where: { email, isVerified: false } });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({ email, name });
    console.log("jhvbdljkgbg;kjdfg")
    res.status(201).json({ message: 'Signup successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error during signup', error });
  }
};

//  login
export const verifyLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ where: { email, otp } });

    if (!otpRecord || isOTPExpired(otpRecord.expiresAt)) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
};


export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'piyush.jalandar@hiteshi.com',
      pass: 'obhl grtx qhda gdxl',
    },
  });
console.log("email",email,"otp",otp);

  const mailOptions = {
    from: 'piyush.jalandar@hiteshi.com',
    to:email,
    subject: 'Your OTP for Login/Signup',
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  };

  try {
    // to send Email 
    await transporter.sendMail(mailOptions);  //ye tha phle
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error('Failed to send OTP email');
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  console.log(email);
  

  try {
    const otp = generateOTP();
    const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000); // Expires in 5 minutes

    await OTP.create({ email, otp, expiresAt });
    await sendOTPEmail(email, otp);
    const user = await User.create({ email, name });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error("Error sending OTP email:", error);  
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
};

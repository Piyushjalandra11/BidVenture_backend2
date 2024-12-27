import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { generateOTP } from '../../../helpers/otp';
import OTP from '../otp/model';
import User from './model';
import { isOTPExpired } from './service';
import { generateJWT } from '../../../helpers/jwt';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, name } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });


    const otp = generateOTP();
    const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);


    OTP.create({ email, otp, expiresAt });
    sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully, please verify to login', userExist: existingUser ? true : false });

  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
};


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
      res.status(400).json({ message: 'User already exists, please login' });
      return;
    }

    const user = await User.create({ email, name, isVerified: true });
    const token = generateJWT(user);

    res.status(201).json({ message: 'Signup successful', user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error during signup', error });
  }
};


export const verifySignin = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({
      where: {
        email,
        otp: otp.toString(),
      },
    });

    if (!otpRecord || isOTPExpired(otpRecord.expiresAt)) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: 'User not found, please sign up first' });
      return;
    }



    const token = generateJWT(user);

    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    console.error("Error during signin verification:", error);
    res.status(500).json({ message: 'Error during signin verification', error });
  }
};


export const sendOTPForSignin = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      res.status(404).json({ message: 'User not found, please sign up first' });
      return;
    }

    const otp = generateOTP();
    const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);

    await OTP.create({ email, otp, expiresAt });
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully for login' });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: 'Failed to send OTP', error });
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

  const mailOptions = {
    from: 'piyush.jalandar@hiteshi.com',
    to: email,
    subject: 'Your OTP for Login/Signup',
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error('Failed to send OTP email');
  }
};

export const generateOTP = (): string => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  };
  
  export const isOTPExpired = (expiresAt: Date): boolean => {
    return new Date() > expiresAt;
  };
  
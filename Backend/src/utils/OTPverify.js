import { OTP } from '../models/OTP.models.js';
import bcrypt from 'bcrypt';

export const verifyOTP = async (email, otp) => {
  try {
    const record = await OTP.findOne({ email });

    if (!record) {
      return {
        success: false,
        message: "Invalid OTP"
      };
    }

    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ email });

      return {
        success: false,
        message: "OTP has expired"
      };
    }

    const isMatch = await bcrypt.compare(
      otp,
      record.otpHashed
    );

    if (!isMatch) {
      return {
        success: false,
        message: "Invalid OTP"
      };
    }

    return {
      success: true
    };

  } catch (error) {
    console.error("Error verifying OTP:", error);

    return {
      success: false,
      message: "Server Error"
    };
  }
};


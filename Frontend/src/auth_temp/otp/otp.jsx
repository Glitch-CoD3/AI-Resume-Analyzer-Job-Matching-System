import React, { useState, useRef } from "react";
import "./otp.css";
import { useLocation, useNavigate } from "react-router-dom";
import AxiosInstance from "../../api/axiosInstance.jsx";

const OTP_LENGTH = 6;

const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ get email from register page or localStorage
  const email =
    location.state?.email || localStorage.getItem("verifyEmail");

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ✅ VERIFY OTP API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");
    console.log("Submitting OTP:", finalOtp);

    if (finalOtp.length !== 6) {
      alert("Please enter complete OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await AxiosInstance.post("auth/verify-email", {
        email,
        otp: finalOtp,
      });

      console.log("OTP Verified:", res.data);
      alert("OTP Verified Successfully!");

      // ✅ clear stored email
      localStorage.removeItem("verifyEmail");

      // ✅ redirect
      navigate("/login");

    } catch (error) {
      const msg =
        error.response?.data?.message || "Invalid or expired OTP";
      alert(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESEND OTP API
  const handleResend = async () => {
    try {
      await AxiosInstance.post("auth/resend-otp", { email });
      alert("OTP sent again to your email");
    } catch (error) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="container">
      <div className="card">

        <h2>Verify OTP</h2>
        <p>
          Enter the 6-digit code sent to <br />
          <b>{email}</b>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otpBox">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="resend">
          Didn’t receive code?{" "}
          <span onClick={handleResend} style={{ cursor: "pointer", color: "#22d3ee" }}>
            Resend OTP
          </span>
        </p>

      </div>
    </div>
  );
};

export default OtpVerification;
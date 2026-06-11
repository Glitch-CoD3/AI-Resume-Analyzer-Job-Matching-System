import React, { useState } from "react";
import "./forgotPassword.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import AxiosInstance from '../../api/axiosInstance.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Make the API call to send the reset email/link
      const response = await AxiosInstance.post("auth/forget-password", {
        email: email,
      });

      console.log("Success:", response.data);
      alert("Verification successful! Please set your new password.");

      // 2. Navigate to the New Password page
      // Tip: You can pass the email via state so the next page knows which user is resetting
      navigate("/reset-password", { state: { email } });

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Forgot Password</h2>
        <p>Enter your email to reset your password</p>

        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email Address</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>

        <p className="back">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
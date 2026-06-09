import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AxiosInstance from '../../api/axiosInstance.jsx';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from the navigation state (passed from ForgotPassword)
  const email = location.state?.email || "";

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await AxiosInstance.post("auth/reset-password", {
        email: email,
        password: form.password
      });

      alert("Password updated successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Set New Password</h2>
        <p>Enter your new password below</p>

        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <label>New Password</label>
          </div>

          <div className="inputBox">
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <label>Confirm Password</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
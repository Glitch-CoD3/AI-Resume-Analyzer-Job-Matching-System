import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom"; // Added for navigation
import AxiosInstance from '../../api/axiosInstance.jsx'; // Import your axios instance

const Login = () => {
  const navigate = useNavigate(); // Hook for redirection
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call your actual backend endpoint
      const response = await AxiosInstance.post("auth/login", {
        email: form.email,
        password: form.password,
      });

      console.log("Login Success:", response.data);
      
      // 2. Optional: Save token if your backend provides one
      // localStorage.setItem("token", response.data.token);

      alert("Login Successful!");

      // 3. Navigate to Home or Dashboard
      navigate("/home"); 

    } catch (error) {
      // 4. Handle Errors (Wrong password, user doesn't exist, etc.)
      const errorMsg = error.response?.data?.message || "Login failed. Please try again.";
      alert(errorMsg);
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome Back</h2>
        <p>Login to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label>Email Address</label>
          </div>

          <div className="inputBox">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <label>Password</label>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            {/* Forgot password usually links to a separate route */}
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="register">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
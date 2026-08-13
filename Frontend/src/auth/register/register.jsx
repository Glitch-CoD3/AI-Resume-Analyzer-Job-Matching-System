import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AxiosInstance from '../../api/axiosInstance.jsx'

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await AxiosInstance.post("auth/register", {
        username,
        email,
        password
      });

      console.log("API Response:", response.data);

      alert("Registration Successful!");

      setTimeout(() => {
        navigate("/OtpVerification", {
          state: { email: form.email }
        });
      }, 1000);

    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Account</h2>
        <p>Sign up to get started</p>

        <form onSubmit={handleSubmit}>

          <div className="inputBox">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <label>username</label>
          </div>

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

          <button type="submit">Register</button>

          <p className="login">
            Already have an account? <Link to="/login">Login</Link>   ✅
          </p>



        </form>
      </div>
    </div>
  );
};

export default Register;
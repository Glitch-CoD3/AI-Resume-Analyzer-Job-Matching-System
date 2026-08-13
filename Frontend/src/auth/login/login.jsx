import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from '../../api/axiosInstance.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { checkAuthStatus } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // 1. Call login API
      await AxiosInstance.post('/auth/login', {
        email,
        password,
      });

      // 2. Check authentication status
      const authenticated = await checkAuthStatus();

      // 3. Navigate to home if authenticated
      if (authenticated) {
        navigate('/home', {
          replace: true,
        });
      }

    } catch (error) {
      console.error(
        'Login error:',
        error.response?.data || error.message
      );

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email Address</label>
          </div>

          <div className="inputBox">
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="register">
            Don’t have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;
import React from "react";
import { Link } from "react-router-dom";
import "./notFound.css"; // We'll add a few specific styles for the 404 look

const NotFound = () => {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '80px', margin: '0', color: '#ff4b2b' }}>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>
          The page you are looking for might have been removed, 
          had its name changed, or is temporarily unavailable.
        </p>

        <div style={{ marginTop: '30px' }}>
          <Link to="/" className="back-home-btn">
            <button type="button">Back to Home</button>
          </Link>
        </div>

        <p className="login" style={{ marginTop: '20px' }}>
          Need help? <Link to="/login">Go to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
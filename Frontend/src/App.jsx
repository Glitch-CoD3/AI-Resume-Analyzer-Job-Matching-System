import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Auth/register/Register';
import Login from './Auth/login/Login'; // Import your new Login page
import Home from './Auth/Home/home';
import NotFound from './pages/notFoundPage/notFoundPage.jsx';
import ForgotPassword from './Auth/forgotPass/forgotPassword.jsx';
import ResetPassword from './Auth/setNewPassword/setNewPassword.jsx';
import OtpVerification from './Auth/OTP/otp.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Set Login as the default page (at "/") */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/OtpVerification" element={<OtpVerification />} />
        <Route path="/not-found" element={<NotFound />} />

        {/* Catch-all: redirect any unknown URL to not-found */}
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </Router>
  );
}

export default App;
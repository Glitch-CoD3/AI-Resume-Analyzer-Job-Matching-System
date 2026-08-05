import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { GuestRoute, ProtectedRoute } from './routes/ProtectedRoute.jsx';

import Register from './auth/register/Register.jsx';
import Login from './auth/login/login.jsx';
import NotFound from './pages/notFoundPage/notFoundPage.jsx';
import ForgotPassword from './auth/forgotPass/forgotPassword.jsx';
import ResetPassword from './auth/setnewpassword/setNewPassword.jsx';
import OtpVerification from './auth/otp/otp.jsx';
import HomePage from './pages/Home/home.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Guest-Only Routes: Redirects to /home if authenticated */}
          <Route element={<GuestRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/OtpVerification" element={<OtpVerification />} />
          </Route>

          {/* Protected Routes: Redirects to /login if NOT authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
          </Route>

          {/* Public / Misc */}
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
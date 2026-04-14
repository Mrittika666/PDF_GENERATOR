import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useState } from "react";

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ChangePassword from './pages/ChangePassword';
import AuthSuccess from './pages/AuthSuccess';
import Dashboard from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword';

// ✅ Protected Route
const ProtectedRoute = ({ user }) => {
  return user ? <Dashboard user={user} /> : <Navigate to="/login" />;
};

export default function App() {

  // ✅ Load user from localStorage ONCE
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("userData");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ✅ Router (STABLE)
  const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/signup', element: <Signup /> },
    { path: '/login', element: <Login setUser={setUser} /> },
    { path: '/verify', element: <VerifyEmail /> },
    { path: '/verify/:token', element: <Verify /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/verify-otp/:email', element: <VerifyOTP /> },
    { path: '/reset-password/:email/:otp', element: <ResetPassword /> },
    { path: '/change-password/:email/:otp', element: <ChangePassword /> },
    { path: '/auth-success', element: <AuthSuccess /> },
    { path: '/dashboard', element: <ProtectedRoute user={user} /> }
  ]);

  return <RouterProvider router={router} />;
}
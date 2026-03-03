import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

export default function App() {
  const [user, setUser] = useState(null);

  // Check if user is already logged in when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

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
    {
      path: '/dashboard',
      element: user ? <Dashboard user={user} /> : <Navigate to="/login" />
    },
  ]);

  return <RouterProvider router={router} />;
}
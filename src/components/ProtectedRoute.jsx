import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, otpVerified } = useAuth();

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Checking authentication...
      </div>
    );

  // 🔐 Only allow access if Firebase user exists AND OTP verified
  if (!user || !otpVerified) return <Navigate to="/" replace />;

  return children;
}

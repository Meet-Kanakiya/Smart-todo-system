import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { sendOTPEmail } from "../lib/SendOTP";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import "../css/Login.css"; // ✅ Add this line

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { setOtpVerified } = useAuth();

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      const otpCode = generateOTP();
      localStorage.setItem("otp", otpCode);
      localStorage.setItem("to_email", email);
      await sendOTPEmail(email, otpCode);
      Swal.fire({
        icon: "success",
        title: "OTP Sent!",
        text: "Check your email for verification code.",
        timer: 2000,
        showConfirmButton: false,
      });
      setOtpVisible(true);
    } catch (err) {
      Swal.fire("Login Failed", "Invalid email or password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const storedOtp = localStorage.getItem("otp");
    const storedEmail = localStorage.getItem("to_email");

    if (otp === storedOtp) {
      Swal.fire({
        icon: "success",
        title: "Verification Successful!",
        text: "Access granted.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        localStorage.removeItem("otp");
        localStorage.setItem("otp_verified", "true");
        localStorage.setItem("user", storedEmail);
        setOtpVerified(true);
        nav("/dashboard");
      });
    } else {
      Swal.fire("Invalid OTP", "Please enter the correct code.", "error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <p>Sign in securely to access your dashboard.</p>

        <form onSubmit={otpVisible ? handleVerifyOtp : handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={otpVisible}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            disabled={otpVisible}
          />

          {otpVisible && (
            <>
              <label>OTP (6-Digit Code)</label>
              <input
                type="text"
                placeholder="Enter OTP from email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
              />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : otpVisible ? "Verify OTP and Log In" : "Log In"}
          </button>
        </form>

        <p className="forgot-password" id="forgot-pass" onClick={() => nav("/forgot-password")}>
          Forgot Password?
        </p>

        <div className="signup-text">
          <small>
            Don’t have an account? <Link to="/signup" id="SignUp">Sign Up</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function VerifyOtp() {
  const [otpInput, setOtpInput] = useState("");
  const nav = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();

    const storedOtp = localStorage.getItem("otp");
    const pendingEmail = localStorage.getItem("to_email");

    if (!storedOtp || !pendingEmail) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please log in again to get a new OTP.",
        confirmButtonColor: "#d33",
      });
      nav("/");
      return;
    }

    if (otpInput === storedOtp) {
      Swal.fire({
        icon: "success",
        title: "OTP Verified!",
        text: "Welcome to your dashboard!",
        confirmButtonColor: "#007bff",
      }).then(() => {
        localStorage.removeItem("otp");
        localStorage.setItem("user", pendingEmail);
        nav("/dashboard");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please check your code and try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: 350,
          padding: 25,
          borderRadius: 10,
          background: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Verify OTP</h2>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 5,
              border: "1px solid #ccc",
              fontSize: 16,
              marginBottom: 15,
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 10,
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}

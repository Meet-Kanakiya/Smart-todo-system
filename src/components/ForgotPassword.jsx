// import React, { useState } from 'react';
// import { sendPasswordResetEmail } from 'firebase/auth';
// import { auth } from '../firebase';
// import { sendOTPEmail } from '../lib/SendOTP';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import '../css/ForgotPassword.css'; // ✅ Add this line

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// export default function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSendCode = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const otpCode = generateOTP();
//     try {
//       localStorage.setItem('reset_otp', otpCode);
//       localStorage.setItem('reset_email', email);
//       await sendOTPEmail(email, otpCode);
//       Swal.fire('Success', `OTP sent to ${email}.`, 'success');
//       setStep(2);
//     } catch (err) {
//       Swal.fire('Error', 'Problem sending OTP. Please check the email.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     const storedOtp = localStorage.getItem('reset_otp');
//     if (otp === storedOtp) {
//       setLoading(true);
//       const resetEmail = localStorage.getItem('reset_email') || email;
//       try {
//         await Swal.fire('Verified', 'OTP matched! Sending secure reset link to your email.', 'success');
//         await sendPasswordResetEmail(auth, resetEmail);
//         Swal.fire({
//           icon: 'info',
//           title: 'Reset Link Sent!',
//           html: `A secure link has been sent to <b>${resetEmail}</b>.<br/>Please check your inbox or spam folder to set a new password.`,
//           confirmButtonColor: '#2563eb'
//         }).then(() => {
//           localStorage.removeItem('reset_otp');
//           localStorage.removeItem('reset_email');
//           navigate('/');
//         });
//       } catch {
//         Swal.fire('Error', 'Could not send reset link. Make sure the email is registered.', 'error');
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       Swal.fire('Invalid OTP', 'Please enter the correct code.', 'error');
//     }
//   };

//   return (
//     <div className="forgot-page">
//       <div className="forgot-card">
//         <h2>Forgot Password</h2>
//         <p>{step === 1 ? 'Enter your registered email to receive an OTP.' : 'Enter the 6-digit OTP sent to your email.'}</p>

//         {step === 1 && (
//           <form onSubmit={handleSendCode}>
//             <label>Email Address</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               required
//             />
//             <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
//           </form>
//         )}

//         {step === 2 && (
//           <form onSubmit={handleVerifyOtp}>
//             <label>Enter OTP</label>
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter 6-digit code"
//               required
//             />
//             <button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify & Send Reset Link'}</button>
//           </form>
//         )}

//         <p className="footer">
//           <a href="/">Back to Login</a>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { sendOTPEmail } from '../lib/SendOTP';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../css/ForgotPassword.css';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpCode = generateOTP();
    try {
      localStorage.setItem('reset_otp', otpCode);
      localStorage.setItem('reset_email', email);
      await sendOTPEmail(email, otpCode);
      Swal.fire('Success', `OTP sent to ${email}.`, 'success');
      setStep(2);
    } catch (err) {
      Swal.fire('Error', 'Problem sending OTP. Please check the email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const storedOtp = localStorage.getItem('reset_otp');
    if (otp === storedOtp) {
      setLoading(true);
      const resetEmail = localStorage.getItem('reset_email') || email;
      try {
        await Swal.fire('Verified', 'OTP matched! Sending secure reset link to your email.', 'success');
        await sendPasswordResetEmail(auth, resetEmail);
        Swal.fire({
          icon: 'info',
          title: 'Reset Link Sent!',
          html: `A secure link has been sent to <b>${resetEmail}</b>.<br/>Please check your inbox or spam folder to set a new password.`,
          confirmButtonColor: '#2563eb'
        }).then(() => {
          localStorage.removeItem('reset_otp');
          localStorage.removeItem('reset_email');
          navigate('/');
        });
      } catch {
        Swal.fire('Error', 'Could not send reset link. Make sure the email is registered.', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      Swal.fire('Invalid OTP', 'Please enter the correct code.', 'error');
    }
  };

  return (
    <div className="forgot-page min-h-screen bg-gradient-to-r from-sky-100 to-sky-50 flex justify-center items-center font-sans px-4 py-8 sm:px-6">

      <div className="forgot-card w-full max-w-[340px] sm:max-w-sm md:max-w-md bg-white rounded-xl shadow-lg px-5 py-8 sm:px-8 sm:py-9 text-left">

        <h2 className="text-blue-600 text-xl sm:text-2xl lg:text-[26px] font-semibold text-center mb-2 sm:mb-3">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-xs sm:text-sm text-center mb-5 sm:mb-6 leading-relaxed">
          {step === 1
            ? 'Enter your registered email to receive an OTP.'
            : 'Enter the 6-digit OTP sent to your email.'}
        </p>

        {step === 1 && (
          <form onSubmit={handleSendCode} className="flex flex-col gap-1">

            <label className="font-medium text-xs sm:text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition mb-4 box-border"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg text-sm sm:text-base transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-1">

            <label className="font-medium text-xs sm:text-sm text-gray-600 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition mb-4 box-border"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg text-sm sm:text-base transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? 'Verifying...' : 'Verify & Send Reset Link'}
            </button>

          </form>
        )}

        <p className="text-center mt-4 sm:mt-5 text-xs sm:text-sm">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium no-underline transition-colors duration-150"
          >
            Back to Login
          </a>
        </p>

      </div>
    </div>
  );
}

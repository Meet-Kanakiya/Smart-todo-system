// import { sendOTPEmail, generateOTP } from "../lib/SendOTP";
// import { auth } from "../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useState } from "react";

// function TwoStepLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [generatedOtp, setGeneratedOtp] = useState(null);
//   const [step, setStep] = useState(1);

//   const handleLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       const newOtp = generateOTP();
//       setGeneratedOtp(newOtp);
//       await sendOTPEmail(email, newOtp);
//       setStep(2);
//     } catch (err) {
//       alert("Invalid email or password");
//     }
//   };

//   const verifyOtp = () => {
//     if (otp === generatedOtp) {
//       alert("✅ Login Successful!");
//     } else {
//       alert("❌ Invalid OTP");
//     }
//   };

//   return (
//     <div>
//       {step === 1 && (
//         <div>
//           <h3>Login</h3>
//           <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
//           <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
//           <button onClick={handleLogin}>Send OTP</button>
//         </div>
//       )}

//       {step === 2 && (
//         <div>
//           <h3>Enter OTP</h3>
//           <input type="text" placeholder="Enter 6-digit OTP" onChange={e => setOtp(e.target.value)} />
//           <button onClick={verifyOtp}>Verify</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TwoStepLogin;

// import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../firebase";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { useNavigate, Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import "../css/Signup.css"; // ✅ Add this line

// export default function Signup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [pw, setPw] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [validation, setValidation] = useState({
//     length: false,
//     upper: false,
//     lower: false,
//     number: false,
//     special: false,
//   });

//   const nav = useNavigate();

//   // Validate password live
//   const handlePasswordChange = (value) => {
//     setPw(value);
//     setValidation({
//       length: value.length >= 6,
//       upper: /[A-Z]/.test(value),
//       lower: /[a-z]/.test(value),
//       number: /[0-9]/.test(value),
//       special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
//     });
//   };

//   const isPasswordValid =
//     validation.length &&
//     validation.upper &&
//     validation.lower &&
//     validation.number &&
//     validation.special;

//   const saveUserToDB = async (user) => {
//     await setDoc(doc(db, "users", user.uid), {
//       uid: user.uid,
//       name,
//       email,
//       createdAt: serverTimestamp(),
//     });
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!isPasswordValid) {
//       Swal.fire({
//         icon: "warning",
//         title: "Weak Password",
//         text: "Password must meet all complexity requirements.",
//       });
//       setLoading(false);
//       return;
//     }

//     try {
//       const userCred = await createUserWithEmailAndPassword(auth, email, pw);
//       await saveUserToDB(userCred.user);

//       Swal.fire({
//         icon: "success",
//         title: "Signup Successful!",
//         text: "Redirecting to Dashboard...",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       setTimeout(() => {
//         nav("/dashboard");
//       }, 1500);
//     } catch (err) {
//       let errorMessage = err.message;
//       if (err.code === "auth/email-already-in-use") {
//         errorMessage = "This email is already registered.";
//       }
//       Swal.fire({
//         icon: "error",
//         title: "Signup Failed",
//         text: errorMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="signup-page">
//       <div className="signup-container">
//         <div style={{ textAlign: "center", marginBottom: 20 }}>
//           <h2>Create Account</h2>
//           <p>Join the Smart To-Do Platform 🎯</p>
//         </div>

//         <form onSubmit={handleSignup}>
//           <label>Full Name</label>
//           <input
//             type="text"
//             placeholder="Your Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />

//           <label>Email</label>
//           <input
//             type="email"
//             placeholder="Your Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="Create Password"
//             value={pw}
//             onChange={(e) => handlePasswordChange(e.target.value)}
//             required
//           />

//           {/* Live Password Feedback */}
//           {pw.length > 0 && (
//             <div className="password-feedback">
//               <p className={validation.length ? "valid" : "invalid"}>
//                 {validation.length ? "✅" : "❌"} At least 6 characters
//               </p>
//               <p className={validation.upper ? "valid" : "invalid"}>
//                 {validation.upper ? "✅" : "❌"} Uppercase letter (A-Z)
//               </p>
//               <p className={validation.lower ? "valid" : "invalid"}>
//                 {validation.lower ? "✅" : "❌"} Lowercase letter (a-z)
//               </p>
//               <p className={validation.number ? "valid" : "invalid"}>
//                 {validation.number ? "✅" : "❌"} Number (0-9)
//               </p>
//               <p className={validation.special ? "valid" : "invalid"}>
//                 {validation.special ? "✅" : "❌"} Special symbol (!@#$…)
//               </p>
//             </div>
//           )}

//           <button type="submit" disabled={loading}>
//             {loading ? "Creating..." : "Create Account"}
//           </button>
//         </form>

//         <div className="signup-text">
//           <small>
//             Already have an account? <Link to="/" id="Login">Login</Link>
//           </small>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/Signup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const nav = useNavigate();

  const handlePasswordChange = (value) => {
    setPw(value);
    setValidation({
      length: value.length >= 6,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const isPasswordValid =
    validation.length &&
    validation.upper &&
    validation.lower &&
    validation.number &&
    validation.special;

  const saveUserToDB = async (user) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      createdAt: serverTimestamp(),
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isPasswordValid) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must meet all complexity requirements.",
      });
      setLoading(false);
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pw);
      await saveUserToDB(userCred.user);

      Swal.fire({
        icon: "success",
        title: "Signup Successful!",
        text: "Redirecting to Dashboard...",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        nav("/dashboard");
      }, 1500);
    } catch (err) {
      let errorMessage = err.message;
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      }
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">

        <div className="signup-header">
          <h2>Create Account</h2>
          <p>Join the Smart To-Do Platform 🎯</p>
        </div>

        <form onSubmit={handleSignup}>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create Password"
            value={pw}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
          />

          {pw.length > 0 && (
            <div className="password-feedback">
              <p className={validation.length ? "valid" : "invalid"}>
                {validation.length ? "✅" : "❌"} At least 6 characters
              </p>
              <p className={validation.upper ? "valid" : "invalid"}>
                {validation.upper ? "✅" : "❌"} Uppercase letter (A-Z)
              </p>
              <p className={validation.lower ? "valid" : "invalid"}>
                {validation.lower ? "✅" : "❌"} Lowercase letter (a-z)
              </p>
              <p className={validation.number ? "valid" : "invalid"}>
                {validation.number ? "✅" : "❌"} Number (0-9)
              </p>
              <p className={validation.special ? "valid" : "invalid"}>
                {validation.special ? "✅" : "❌"} Special symbol (!@#$…)
              </p>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <div className="signup-text">
          <small>
            Already have an account?{" "}
            <Link to="/" id="Login">Login</Link>
          </small>
        </div>

      </div>
    </div>
  );
}
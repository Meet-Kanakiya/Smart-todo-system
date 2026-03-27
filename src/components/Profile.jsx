// import React, { useState, useEffect } from "react";
// import { db, auth } from "../firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import Swal from "sweetalert2";
// import {
//   FaUserCircle,
//   FaUniversity,
//   FaPhoneAlt,
//   FaTransgender,
//   FaBirthdayCake,
//   FaEnvelope,
//   FaGraduationCap,
//   FaEdit,
// } from "react-icons/fa";
// import "../css/Profile.css";

// const Profile = () => {
//   const [profile, setProfile] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     college: "",
//     branch: "",
//     phone: "",
//     gender: "",
//     age: "",
//   });

//   const user = auth.currentUser;

//   useEffect(() => {
//     if (user) loadProfile();
//   }, [user]);

//   const loadProfile = async () => {
//     try {
//       const docRef = doc(db, "profiles", user.uid);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setProfile({ ...data, email: user.email }); // ensure email is included
//         setFormData({ ...data, email: user.email });
//       } else {
//         setFormData({ ...formData, email: user.email }); // for new profile
//       }
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const docRef = doc(db, "profiles", user.uid);
//       await setDoc(docRef, formData);
//       setProfile(formData);
//       setEditMode(false);
//       Swal.fire("✅ Success", "Profile updated successfully!", "success");
//     } catch (err) {
//       console.error(err);
//       Swal.fire("❌ Error", "Failed to update profile!", "error");
//     }
//   };

//   if (loading) return <div className="loading">Loading profile...</div>;

//   if (!profile || editMode)
//     return (
//       <div className="profile-container">
//         <div className="profile-card form-mode">
//           <h2>{profile ? "Edit Profile" : "Create Profile"}</h2>
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               required
//             />
//             <input
//               type="email"
//               value={formData.email || ""}
//               disabled
//               className="disabled"
//             />

//             <input
//               type="text"
//               placeholder="College Name"
//               value={formData.college}
//               onChange={(e) => setFormData({ ...formData, college: e.target.value })}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Branch"
//               value={formData.branch}
//               onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Phone Number"
//               value={formData.phone}
//               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Gender"
//               value={formData.gender}
//               onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
//               required
//             />
//             <input
//               type="number"
//               placeholder="Age"
//               value={formData.age}
//               onChange={(e) => setFormData({ ...formData, age: e.target.value })}
//               required
//             />
//             <button type="submit" className="save-btn">
//               Save Profile
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         <FaUserCircle className="avatar" />
//         <h2>{profile.name}</h2>
//         <p className="role">My Profile</p>

//         <div className="details">
//           <p>
//             <FaEnvelope className="icon" /> {profile.email}
//           </p>
//           <p>
//             <FaUniversity className="icon" /> {profile.college}
//           </p>
//           <p>
//             <FaGraduationCap className="icon" /> {profile.branch}
//           </p>
//           <p>
//             <FaPhoneAlt className="icon" /> {profile.phone}
//           </p>
//           <p>
//             <FaTransgender className="icon" /> {profile.gender}
//           </p>
//           <p>
//             <FaBirthdayCake className="icon" /> Age: {profile.age}
//           </p>
//         </div>

//         <button onClick={() => setEditMode(true)} className="edit-btn">
//           <FaEdit /> Edit Profile
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import {
  FaUserCircle,
  FaUniversity,
  FaPhoneAlt,
  FaTransgender,
  FaBirthdayCake,
  FaEnvelope,
  FaGraduationCap,
  FaEdit,
} from "react-icons/fa";
import "../css/Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    phone: "",
    gender: "",
    age: "",
  });

  const user = auth.currentUser;

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const docRef = doc(db, "profiles", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({ ...data, email: user.email });
        setFormData({ ...data, email: user.email });
      } else {
        setFormData({ ...formData, email: user.email });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "profiles", user.uid);
      await setDoc(docRef, formData);
      setProfile(formData);
      setEditMode(false);
      Swal.fire("✅ Success", "Profile updated successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Failed to update profile!", "error");
    }
  };

  if (loading)
    return <div className="loading">Loading profile...</div>;

  if (!profile || editMode)
    return (
      <div className="profile-container">
        <div className="profile-card form-mode">

          <h2>{profile ? "Edit Profile" : "Create Profile"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              value={formData.email || ""}
              disabled
              className="disabled"
            />
            <input
              type="text"
              placeholder="College Name"
              value={formData.college}
              onChange={(e) =>
                setFormData({ ...formData, college: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Branch"
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              required
            />
            <button type="submit" className="save-btn">
              Save Profile
            </button>
          </form>

        </div>
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-card">

        <FaUserCircle className="avatar" />
        <h2>{profile.name}</h2>
        <p className="role">My Profile</p>

        <div className="details">
          <p><FaEnvelope className="icon" /> {profile.email}</p>
          <p><FaUniversity className="icon" /> {profile.college}</p>
          <p><FaGraduationCap className="icon" /> {profile.branch}</p>
          <p><FaPhoneAlt className="icon" /> {profile.phone}</p>
          <p><FaTransgender className="icon" /> {profile.gender}</p>
          <p><FaBirthdayCake className="icon" /> Age: {profile.age}</p>
        </div>

        <button onClick={() => setEditMode(true)} className="edit-btn">
          <FaEdit /> Edit Profile
        </button>

      </div>
    </div>
  );
};

export default Profile;
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  ListTodo,
  Calendar,
  Timer,
  StickyNote,
  Users,
  BarChart3,
  Brain,
  User,
  LogOut,
} from "lucide-react";
import "../css/Sidebar.css"; // ✅ Import CSS

export default function Sidebar({ activeSection, setActiveSection }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuItems = [
    { id: "profile", label: "My Profile", icon: <User size={18} /> },
    { id: "todo", label: "To-Do", icon: <ListTodo size={18} /> },
    { id: "planner", label: "Planner", icon: <Calendar size={18} /> },
    { id: "pomodoro", label: "Pomodoro", icon: <Timer size={18} /> },
    { id: "groups", label: "Groups", icon: <Users size={18} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { id: "ai", label: "AI Suggestions", icon: <Brain size={18} /> },
  ];

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sidebar"
    >
      <div>
        {/* Brand + User Info */}
        <div className="brand">
          <motion.div whileHover={{ rotate: 10 }} className="brand-logo">
            SP
          </motion.div>
          <div>
            <div className="brand-name">Smart Planner</div>
            <div className="brand-email">
              {user ? user.email.split("@")[0] : "Guest"}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="nav-menu">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.li key={item.id} whileTap={{ scale: 0.97 }} className="nav-item">
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={isActive ? "active" : ""}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </motion.aside>
  );
}

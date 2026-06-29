import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import TodoList from "./TodoList";
import Planner from "./Planner";
import Pomodoro from "./Pomodoro";
import Notes from "./Notes";
import Groups from "./Groups";
import Profile from "./Profile";
import Analytics from "./Analytics";
import StudyAssistant from "./StudyAssistant";
import "../css/Dashboard.css";


let authInstance = null;
let isInitialized = false;

const initializeFirebase = (setAuth) => {
  if (!isInitialized) {
    try {
      const firebaseConfig =
        typeof window._firebase_config !== "undefined"
          ? JSON.parse(window._firebase_config)
          : null;
      if (firebaseConfig) {
        const app = initializeApp(firebaseConfig);
        authInstance = getAuth(app);
        setAuth(authInstance);
        isInitialized = true;
      }
    } catch (err) {
      console.error("Firebase Init Failed:", err);
    }
  } else {
    setAuth(authInstance);
  }
};

export default function Dashboard() {

  const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
  // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem("lastSection") || "profile"
  );

  useEffect(() => {
    localStorage.setItem("lastSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    initializeFirebase(setAuth);
  }, []);

  const titleMap = {
    ai: "AI Study Suggestions 🤖",
    todo: "Your To-Do List 📝",
    profile: "Profile 👤",
    pomodoro: "Pomodoro Strategy 🕒",
    planner: "Study Planner 📅",
    notes: "My Notes 🗒",
    groups: "Collaborative Study Rooms 👥",
    analytics: "Task Performance Analytics 📈",
  };

  const renderMainSection = () => {
    switch (activeSection) {
      case "profile": return <Profile />;
      case "todo": return <TodoList />;
      case "planner": return <Planner />;
      case "pomodoro": return <Pomodoro />;
      case "notes": return <Notes />;
      case "groups": return <Groups />;
      case "analytics": return <Analytics />;
      case "ai":
        return <StudyAssistant />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="dashboard-container">

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="dashboard-main">

        <h1 className="
text-xl
sm:text-2xl
lg:text-3xl
font-bold
text-blue-600
mb-6
break-words
">
          {titleMap[activeSection] ?? "Welcome to Smart Planner 🚀"}
        </h1>

        {renderMainSection()}
      </div>

    </div>
  );
}

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

import "../css/Dashboard.css";

const retryFetch = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return res;
    } catch (err) {
      if (i < retries - 1)
        await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
      else throw err;
    }
  }
};

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
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem("lastSection") || "profile"
  );
  const [suggestionQuery, setSuggestionQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("lastSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    initializeFirebase(setAuth);
  }, []);

  const apiKey = "AIzaSyAbIWZ9Np8JgIFfAfJ1xa2oesl7Wq4Dsxk";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const formatResponseText = (text) => {
    if (!text) return "";
    let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/(?:\n|^)\s*[-+*]\s/g, "\n<li>");
    html = html.trim();
    if (html.startsWith("<li>")) {
      html = html.replace(/\n<li>/g, "</li><li>") + "</li>";
      html = "<ul style='padding-left:20px;'>" + html + "</ul>";
    }
    html = html.replace(/\n/g, "<br/>");
    return html;
  };

  const handleAISuggestion = async (e) => {
    e.preventDefault();
    if (!suggestionQuery.trim()) return;
    setAiLoading(true);
    setAiResponse(null);

    const payload = {
      contents: [{ parts: [{ text: suggestionQuery }] }],
      systemInstruction: {
        parts: [{ text: "You are an academic study assistant. Give 3-5 actionable tips." }],
      },
    };

    try {
      const res = await retryFetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiResponse({ text: text || "⚠️ No valid response from AI" });
    } catch (err) {
      setAiResponse({ text: `❌ API Error: ${err.message}` });
    } finally {
      setAiLoading(false);
    }
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
        return (
          <div className="ai-card">
            <h2>🤖 Study Assistant</h2>
            <form onSubmit={handleAISuggestion} className="ai-form">
              <input
                type="text"
                placeholder="Ask about focus, study tips..."
                value={suggestionQuery}
                onChange={(e) => setSuggestionQuery(e.target.value)}
                disabled={aiLoading}
              />
              <button type="submit">{aiLoading ? "Thinking..." : "Ask"}</button>
            </form>
            {aiResponse && (
              <div
                className="ai-response"
                dangerouslySetInnerHTML={{ __html: formatResponseText(aiResponse.text) }}
              />
            )}
          </div>
        );
      default:
        return <Profile />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="dashboard-main">
        <h1 className="dashboard-title">
          {activeSection === "ai"
            ? "AI Study Suggestions 🤖"
            : activeSection === "todo"
            ? "Your To-Do List 📝"
            : activeSection === "profile"
            ? "Profile 👤"
            : activeSection === "pomodoro"
            ? "Pomodoro Strategy 🕒"
            : activeSection === "planner"
            ? "Study Planner 📅"
            : activeSection === "notes"
            ? "My Notes 🗒"
            : activeSection === "groups"
            ? "Collaborative Study Rooms 👥"
            : activeSection === "analytics"
            ? "Task Performance Analytics 📈"
            : "Welcome to Smart Planner 🚀"}
        </h1>
        {renderMainSection()}
      </div>
    </div>
  );
}

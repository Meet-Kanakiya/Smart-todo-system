// import React, { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// import Sidebar from "./Sidebar";
// import TodoList from "./TodoList";
// import Planner from "./Planner";
// import Pomodoro from "./Pomodoro";
// import Notes from "./Notes";
// import Groups from "./Groups";
// import Profile from "./Profile";
// import Analytics from "./Analytics";

// import "../css/Dashboard.css";

// const retryFetch = async (url, options, retries = 3) => {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const res = await fetch(url, options);
//       if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//       return res;
//     } catch (err) {
//       if (i < retries - 1)
//         await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
//       else throw err;
//     }
//   }
// };

// let authInstance = null;
// let isInitialized = false;

// const initializeFirebase = (setAuth) => {
//   if (!isInitialized) {
//     try {
//       const firebaseConfig =
//         typeof window._firebase_config !== "undefined"
//           ? JSON.parse(window._firebase_config)
//           : null;
//       if (firebaseConfig) {
//         const app = initializeApp(firebaseConfig);
//         authInstance = getAuth(app);
//         setAuth(authInstance);
//         isInitialized = true;
//       }
//     } catch (err) {
//       console.error("Firebase Init Failed:", err);
//     }
//   } else {
//     setAuth(authInstance);
//   }
// };

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [auth, setAuth] = useState(null);
//   const [activeSection, setActiveSection] = useState(
//     localStorage.getItem("lastSection") || "profile"
//   );
//   const [suggestionQuery, setSuggestionQuery] = useState("");
//   const [aiResponse, setAiResponse] = useState(null);
//   const [aiLoading, setAiLoading] = useState(false);

//   useEffect(() => {
//     localStorage.setItem("lastSection", activeSection);
//   }, [activeSection]);

//   useEffect(() => {
//     initializeFirebase(setAuth);
//   }, []);

//   const apiKey = "AIzaSyAbIWZ9Np8JgIFfAfJ1xa2oesl7Wq4Dsxk";
//   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

//   const formatResponseText = (text) => {
//     if (!text) return "";
//     let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
//     html = html.replace(/(?:\n|^)\s*[-+*]\s/g, "\n<li>");
//     html = html.trim();
//     if (html.startsWith("<li>")) {
//       html = html.replace(/\n<li>/g, "</li><li>") + "</li>";
//       html = "<ul style='padding-left:20px;'>" + html + "</ul>";
//     }
//     html = html.replace(/\n/g, "<br/>");
//     return html;
//   };

//   const handleAISuggestion = async (e) => {
//     e.preventDefault();
//     if (!suggestionQuery.trim()) return;
//     setAiLoading(true);
//     setAiResponse(null);

//     const payload = {
//       contents: [{ parts: [{ text: suggestionQuery }] }],
//       systemInstruction: {
//         parts: [{ text: "You are an academic study assistant. Give 3-5 actionable tips." }],
//       },
//     };

//     try {
//       const res = await retryFetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const result = await res.json();
//       const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
//       setAiResponse({ text: text || "⚠️ No valid response from AI" });
//     } catch (err) {
//       setAiResponse({ text: `❌ API Error: ${err.message}` });
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const renderMainSection = () => {
//     switch (activeSection) {
//       case "profile": return <Profile />;
//       case "todo": return <TodoList />;
//       case "planner": return <Planner />;
//       case "pomodoro": return <Pomodoro />;
//       case "notes": return <Notes />;
//       case "groups": return <Groups />;
//       case "analytics": return <Analytics />;
//       case "ai":
//         return (
//           <div className="ai-card">
//             <h2>🤖 Study Assistant</h2>
//             <form onSubmit={handleAISuggestion} className="ai-form">
//               <input
//                 type="text"
//                 placeholder="Ask about focus, study tips..."
//                 value={suggestionQuery}
//                 onChange={(e) => setSuggestionQuery(e.target.value)}
//                 disabled={aiLoading}
//               />
//               <button type="submit">{aiLoading ? "Thinking..." : "Ask"}</button>
//             </form>
//             {aiResponse && (
//               <div
//                 className="ai-response"
//                 dangerouslySetInnerHTML={{ __html: formatResponseText(aiResponse.text) }}
//               />
//             )}
//           </div>
//         );
//       default:
//         return <Profile />;
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
//       <div className="dashboard-main">
//         <h1 className="dashboard-title">
//           {activeSection === "ai"
//             ? "AI Study Suggestions 🤖"
//             : activeSection === "todo"
//             ? "Your To-Do List 📝"
//             : activeSection === "profile"
//             ? "Profile 👤"
//             : activeSection === "pomodoro"
//             ? "Pomodoro Strategy 🕒"
//             : activeSection === "planner"
//             ? "Study Planner 📅"
//             : activeSection === "notes"
//             ? "My Notes 🗒"
//             : activeSection === "groups"
//             ? "Collaborative Study Rooms 👥"
//             : activeSection === "analytics"
//             ? "Task Performance Analytics 📈"
//             : "Welcome to Smart Planner 🚀"}
//         </h1>
//         {renderMainSection()}
//       </div>
//     </div>
//   );
// }
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

  const titleMap = {
    ai:        "AI Study Suggestions 🤖",
    todo:      "Your To-Do List 📝",
    profile:   "Profile 👤",
    pomodoro:  "Pomodoro Strategy 🕒",
    planner:   "Study Planner 📅",
    notes:     "My Notes 🗒",
    groups:    "Collaborative Study Rooms 👥",
    analytics: "Task Performance Analytics 📈",
  };

  const renderMainSection = () => {
    switch (activeSection) {
      case "profile":   return <Profile />;
      case "todo":      return <TodoList />;
      case "planner":   return <Planner />;
      case "pomodoro":  return <Pomodoro />;
      case "notes":     return <Notes />;
      case "groups":    return <Groups />;
      case "analytics": return <Analytics />;
      case "ai":
        return (
          <div className="mt-6 bg-white rounded-xl border-l-4 border-blue-600 shadow p-4 sm:p-5">

            <h2 className="text-lg sm:text-xl font-semibold text-blue-600 mt-1 mb-3">
              🤖 Study Assistant
            </h2>

            <form
              onSubmit={handleAISuggestion}
              className="mt-2 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                placeholder="Ask about focus, study tips..."
                value={suggestionQuery}
                onChange={(e) => setSuggestionQuery(e.target.value)}
                disabled={aiLoading}
                className="w-full flex-1 px-3 py-2.5 border border-blue-600 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-60 text-sm sm:text-base min-h-[44px]"
                disabled={aiLoading}
              >
                {aiLoading ? "Thinking..." : "Ask"}
              </button>
            </form>

            {aiResponse && (
              <div
                className="mt-4 p-3 sm:p-4 bg-slate-50 border border-blue-600 rounded-lg leading-relaxed text-sm sm:text-base"
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
    <div className="flex min-h-screen bg-[#f4f7fb]">

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="flex-1 w-0 min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

        <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-blue-600 mt-0 mb-5 sm:mb-6 leading-snug">
          {titleMap[activeSection] ?? "Welcome to Smart Planner 🚀"}
        </h1>

        {renderMainSection()}
      </div>

    </div>
  );
}

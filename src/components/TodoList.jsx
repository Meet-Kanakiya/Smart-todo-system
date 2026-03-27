import React, { useEffect, useState, useMemo, useRef } from "react";
import { Check, Trash2, Plus, Search, Calendar, Columns } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import emailjs from "@emailjs/browser"; // ✅ email system
import { LineAxis } from "@mui/icons-material";
const formatDate = (dateString) => {
  if (!dateString) return "No Date";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
};

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().substring(0, 10)
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { user } = useAuth();
  const priorityOrder = { high: 1, normal: 2, low: 3 };

  // 🕒 Store timeout IDs for cancellation
  const reminders = useRef({});

  // 🧩 Schedule reminder (20s for testing)
  // 🕒 Schedule reminder (20 sec delay for testing)
  const scheduleDailyReminder = (task, user) => {
  // Target time: 11:30 AM
  const targetHour = 11;
  const targetMinute = 30;

  const now = new Date();
  const target = new Date();

  target.setHours(targetHour, targetMinute, 0, 0); // 11:30:00.000

  // If it's already past 11:30 AM today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target - now;

    // console.log(`⏰ Reminder set for "${task.title}" — in 20s`);

    reminders[task.id] = setTimeout(() => {
      emailjs
        .send(
          "service_6fxh3m7", // your EmailJS service ID
          "template_iy5f61b", // your EmailJS template ID
          {
            to_email: user.email, // ✅ logged-in user's email
            task_title: task.title,
            due_date: task.dueDate,
          },
          "-q5nEmNN1amNPtriS" // your EmailJS public key
        )
        .then(() =>
          console.log(`✅ Email sent for : "${task.title}"`)
        )
        .catch((err) => console.error("❌ Email send error:", err));
    }, delay);
  };

  // ❌ Cancel reminder
  const cancelReminder = (taskId) => {
    if (reminders.current[taskId]) {
      clearTimeout(reminders.current[taskId]);
      delete reminders.current[taskId];
      console.log(`🛑 Reminder canceled for task ID: ${taskId}`);
    }
  };

  // 🔄 Load tasks from Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(data);
    });

    return () => unsub();
  }, [user]);

  // ➕ Add new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    try {
      const docRef = await addDoc(collection(db, "users", user.uid, "tasks"), {
        title: title.trim(),
        priority,
        status: "todo",
        dueDate,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      console.log("✅ Task added:", title);
      scheduleReminder({ id: docRef.id, title, dueDate, status: "todo" });
    } catch (err) {
      console.error("Add task error:", err);
    }
  };

  // ✅ Toggle done/undo with email control
  const toggleTaskStatus = async (t) => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid, "tasks", t.id);
      const newStatus = t.status === "done" ? "todo" : "done";
      await updateDoc(ref, { status: newStatus });

      if (newStatus === "done") {
        cancelReminder(t.id);
      } else {
        scheduleReminder({ ...t, status: "todo" });
      }
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  // 🗑️ Delete task + cancel reminder
  const removeTask = async (t) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "tasks", t.id));
      cancelReminder(t.id);
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  // 🎨 Priority colors
  const getPriorityColor = (p) => {
    switch (p) {
      case "high":
        return "#e74c3c";
      case "normal":
        return "#f39c12";
      case "low":
        return "#2ecc71";
      default:
        return "#7f8c8d";
    }
  };

  // 🔍 Filtering + sorting
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.slice();

    if (filterStatus !== "all")
      filtered = filtered.filter((t) => t.status === filterStatus);

    if (searchTerm)
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (filterDate)
      filtered = filtered.filter((t) => t.dueDate === filterDate);

    return filtered.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority])
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [tasks, searchTerm, filterDate, filterStatus]);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "30px auto",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "0 20px",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30, color: "#2c3e50" }}>
        🧩 Smart Task Manager
      </h1>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "nowrap",
          background: "#ecf0f1",
          padding: "10px",
          borderRadius: 10,
          borderLeft: "5px solid #3498db",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "0 10px",
            marginBottom: 15,
            marginTop: 10,
            background: "white",
          }}
        >
          <Search size={20} color="#7f8c8d" style={{ marginRight: 5 }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            style={{
              border: "none",
              outline: "none",
              padding: 0,
              marginLeft: 5,
              minWidth: 300,
              fontSize: 16,
              marginBottom: 15,
            }}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
            marginBottom: 15,
            marginTop: 10,
            background: "white",
          }}
        >
          <option value="all">Status: All</option>
          <option value="todo">To Do</option>
          <option value="done">Done</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
            marginBottom: 15,
            marginTop: 10,
            background: "white",
          }}
        />
        <button
          onClick={() => setFilterDate("")}
          style={{
            padding: "12px",
            marginBottom: 17,
            marginTop: 15,
            borderRadius: 8,
            border: "none",
            background: "#7f8c8d",
            color: "white",
            cursor: "pointer",
          }}
        >
          Clear Date
        </button>
      </div>

      {/* Add Task */}
      <form
        onSubmit={addTask}
        style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          style={{
            flex: 2,
            minWidth: 470,
            padding: "12px 15px",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{
            padding: "5px",
            borderRadius: 8,
            minWidth: 150,
            marginTop: 6,
            marginBottom: 20,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{
            padding: "12px",
            marginTop: 0,
            margin: 0,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(45deg, #3498db, #2980b9)",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: "bold",
            cursor: "pointer",
            // marginTop: 5 
          }}
        >
          <Plus size={18} /> Add Task
        </button>
      </form>

      {/* Task List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        <AnimatePresence>
          {filteredAndSortedTasks.map((t) => (
            <motion.li
              key={t.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              layout
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: t.status === "done" ? "#ecf0f1" : "#f8f9fa",
                padding: 15,
                borderRadius: 10,
                marginBottom: 12,
                borderLeft: `6px solid ${getPriorityColor(t.priority)}`,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                opacity: t.status === "done" ? 0.7 : 1,
              }}
            >
              <div style={{ flex: 1 }}>
                <strong
                  style={{
                    color: t.status === "done" ? "#7f8c8d" : "#2c3e50",
                    textDecoration:
                      t.status === "done" ? "line-through" : "none",
                  }}
                >
                  {t.title}
                </strong>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <Calendar
                    size={14}
                    color={getPriorityColor(t.priority)}
                    style={{ marginRight: 5 }}
                  />
                  <span
                    style={{
                      color: getPriorityColor(t.priority),
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {t.priority.toUpperCase()}
                  </span>
                  <span
                    style={{
                      color: "#7f8c8d",
                      fontSize: 12,
                      marginLeft: 10,
                    }}
                  >
                    Due: {formatDate(t.dueDate)}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => toggleTaskStatus(t)}
                  style={{
                    background:
                      t.status === "done" ? "#2ecc71" : "#3498db",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: 6,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                >
                  <Check size={14} />{" "}
                  {t.status === "done" ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => removeTask(t)}
                  style={{
                    background: "#e74c3c",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: 6,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>

        {filteredAndSortedTasks.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#7f8c8d",
              marginTop: 30,
            }}
          >
            No tasks found. Add one to get started! 📝
          </p>
        )}
      </ul>
    </div>
  );
} 
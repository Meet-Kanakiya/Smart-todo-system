import React, { useEffect, useState, useMemo, useRef } from "react";
import { Check, Trash2, Plus } from "lucide-react";
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
import emailjs from "@emailjs/browser";
import "../css/TodoList.css";

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
  const reminders = useRef({});
  const priorityOrder = { high: 1, normal: 2, low: 3 };

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !user) return;
    const docRef = await addDoc(collection(db, "users", user.uid, "tasks"), {
      title: title.trim(),
      priority,
      status: "todo",
      dueDate,
      createdAt: serverTimestamp(),
    });
    setTitle("");
  };

  const toggleTaskStatus = async (t) => {
    const ref = doc(db, "users", user.uid, "tasks", t.id);
    await updateDoc(ref, { status: t.status === "done" ? "todo" : "done" });
  };

  const removeTask = async (t) => {
    await deleteDoc(doc(db, "users", user.uid, "tasks", t.id));
  };

  const getPriorityColor = (p) =>
    p === "high" ? "#e74c3c" : p === "normal" ? "#f39c12" : "#2ecc71";

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
    return filtered.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }, [tasks, searchTerm, filterDate, filterStatus]);

  return (
    <div className="todo-wrapper">

      <h1 className="todo-heading">🧩 Smart Task Manager</h1>

      {/* FILTERS */}
      <div className="todo-filters">
        <input
          className="todo-filter-input"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="todo-filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="todo">Todo</option>
          <option value="done">Done</option>
        </select>
        <input
          className="todo-filter-date"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* ADD TASK FORM */}
      <form className="todo-form" onSubmit={addTask}>
        <input
          className="todo-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
        <select
          className="todo-priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <input
          className="todo-due-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit" className="todo-add-btn">
          <Plus size={18} /> Add
        </button>
      </form>

      {/* TASK LIST */}
      <ul className="todo-list">
        <AnimatePresence>
          {filteredAndSortedTasks.map((t) => (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`todo-item todo-item--${t.status}`}
              style={{ borderLeftColor: getPriorityColor(t.priority) }}
            >
              <div className="todo-item-info">
                <strong className="todo-item-title">{t.title}</strong>
                <div className="todo-item-due">
                  Due: {formatDate(t.dueDate)}
                </div>
                <span className={`todo-item-badge todo-item-badge--${t.priority}`}>
                  {t.priority}
                </span>
              </div>

              <div className="todo-item-actions">
                <button
                  onClick={() => toggleTaskStatus(t)}
                  className={`todo-btn todo-btn--check ${t.status === "done" ? "todo-btn--done" : ""}`}
                  title={t.status === "done" ? "Mark as todo" : "Mark as done"}
                >
                  <Check size={15} />
                </button>
                <button
                  onClick={() => removeTask(t)}
                  className="todo-btn todo-btn--delete"
                  title="Delete task"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>

        {filteredAndSortedTasks.length === 0 && (
          <li className="todo-empty">No tasks found. Add one above!</li>
        )}
      </ul>

    </div>
  );
}
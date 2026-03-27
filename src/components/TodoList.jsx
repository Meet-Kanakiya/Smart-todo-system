import React, { useEffect, useState, useMemo, useRef } from "react";
import { Check, Trash2, Plus, Search, Calendar } from "lucide-react";
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
    if (filterStatus !== "all") filtered = filtered.filter((t) => t.status === filterStatus);
    if (searchTerm) filtered = filtered.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterDate) filtered = filtered.filter((t) => t.dueDate === filterDate);
    return filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [tasks, searchTerm, filterDate, filterStatus]);

  return (
    <div style={{maxWidth:900, margin:"auto", padding:"clamp(12px,4vw,24px)", fontFamily:"Segoe UI"}}>
      <h1 style={{textAlign:"center"}}>🧩 Smart Task Manager</h1>

      {/* FILTERS */}
      <div style={{
        display:"flex",
        flexWrap:"wrap",
        gap:10,
        background:"#ecf0f1",
        padding:12,
        borderRadius:12
      }}>
        <input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          style={{flex:"1 1 220px", padding:12, borderRadius:8, border:"1px solid #ccc"}}
        />

        <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}
          style={{flex:"1 1 150px", padding:12, borderRadius:8}}>
          <option value="all">All</option>
          <option value="todo">Todo</option>
          <option value="done">Done</option>
        </select>

        <input type="date" value={filterDate}
          onChange={(e)=>setFilterDate(e.target.value)}
          style={{flex:"1 1 170px", padding:12, borderRadius:8}} />
      </div>

      {/* ADD TASK */}
      <form onSubmit={addTask} style={{display:"flex", flexWrap:"wrap", gap:10, marginTop:15}}>
        <input value={title} onChange={(e)=>setTitle(e.target.value)}
          placeholder="Task title"
          style={{flex:"2 1 250px", padding:12, borderRadius:8}}/>

        <select value={priority} onChange={(e)=>setPriority(e.target.value)}
          style={{flex:"1 1 140px", padding:12, borderRadius:8}}>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        <input type="date" value={dueDate}
          onChange={(e)=>setDueDate(e.target.value)}
          style={{flex:"1 1 160px", padding:12, borderRadius:8}}/>

        <button style={{
          flex:"1 1 150px",
          background:"#3498db",
          color:"#fff",
          border:"none",
          borderRadius:8,
          padding:12,
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          gap:6
        }}>
          <Plus size={18}/> Add
        </button>
      </form>

      {/* TASK LIST */}
      <ul style={{listStyle:"none", padding:0, marginTop:20}}>
        <AnimatePresence>
          {filteredAndSortedTasks.map((t)=>(
            <motion.li key={t.id} layout
              style={{
                display:"flex",
                flexWrap:"wrap",
                gap:10,
                justifyContent:"space-between",
                background:"#f8f9fa",
                padding:15,
                borderRadius:12,
                marginBottom:12,
                borderLeft:`6px solid ${getPriorityColor(t.priority)}`
              }}>
              <div style={{flex:"1 1 220px"}}>
                <strong>{t.title}</strong>
                <div style={{fontSize:12}}>Due: {formatDate(t.dueDate)}</div>
              </div>

              <div style={{display:"flex", gap:6}}>
                <button onClick={()=>toggleTaskStatus(t)} style={{background:"#2ecc71",color:"#fff",border:"none",padding:"6px 10px",borderRadius:6}}>
                  <Check size={14}/>
                </button>
                <button onClick={()=>removeTask(t)} style={{background:"#e74c3c",color:"#fff",border:"none",padding:"6px 10px",borderRadius:6}}>
                  <Trash2 size={14}/>
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
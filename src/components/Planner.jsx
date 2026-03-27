import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import "../css/planner.css";
export default function Planner() {
  const [entries, setEntries] = useState([]);
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("Mon");
  const { user } = useAuth();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const themeColor = "#2563eb";
  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }
    const q = query(collection(db, "users", user.uid, "timetable"), orderBy("day"));
    const unsub = onSnapshot(q, (snap) =>
      setEntries(snap.docs.map((d) =>
        ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [user]);
  const add = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !user) {
      Swal.fire({
        icon: "warning",
        title: "Empty Task",
        text: "Please enter a task before adding.",
        confirmButtonColor: themeColor,
      });
      return;
    }
    await addDoc(collection(db, "users", user.uid, "timetable"),
      { subject, day, createdAt: new Date(), });
    setSubject("");
    Swal.fire({
      icon: "success",
      title: "Task Added!",
      text: "Your task has been added successfully.",
      timer: 1500, showConfirmButton: false,
    });
  };
  const remove = async (id) => {
    if (!user) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to recover this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });
    if (result.isConfirmed) {
      await deleteDoc(doc(db, "users", user.uid, "timetable", id));
      Swal.fire({ icon: "success", title: "Deleted!", text: "Your task has been removed.", timer: 1200, showConfirmButton: false, });
    }
  };
  const activeDays = days.filter((d) => entries.some((en) => en.day === d));
  return (<div className="planner-container">
    <div className="planner-card">
      <h2 className="planner-title">Weekly Planner 🗓️</h2>
      <form onSubmit={add} className="planner-form">
        <input className="planner-input" placeholder="Enter a new task..." value={subject} onChange={(e) => setSubject(e.target.value)} />
        <select className="planner-select" value={day} onChange={(e) => setDay(e.target.value)} > {days.map((d) => (<option key={d} value={d}>{d}</option>))} </select>
        <button type="submit" className="planner-add-btn">Add</button>
      </form>
      {activeDays.length === 0 ? (<p className="planner-empty">No tasks yet — add your first one above!</p>) : (<div className="planner-weekly"> {activeDays.map((d) => {
        const items = entries.filter((en) => en.day === d);
        return (<div key={d} className="planner-day"> <strong className="planner-day-title">{d}</strong> {items.map((it) => (<motion.div key={it.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="planner-task" >
          <span>{it.subject}</span> <button onClick={() => remove(it.id)} className="planner-delete-btn" > Delete </button> </motion.div>))} </div>);
      })} </div>)} </div> </div>);
}
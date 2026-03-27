import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Send, ArrowLeft } from "lucide-react";
import "../css/Group.css"; // ✅ unified CSS

export default function GroupChat({ groupId, groupName }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "groups", groupId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) =>
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, [groupId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addDoc(collection(db, "groups", groupId, "messages"), {
      text,
      uid: user.uid,
      userName: user.displayName || "User",
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div className="group-chat-container">
      <div className="group-chat-header">
        <button onClick={() => window.location.reload()} className="back-btn">
          <ArrowLeft size={20} color="white" />
        </button>
        <h2 className="group-chat-title">{groupName} 💬</h2>
      </div>

      <div className="group-chat-messages">
        {messages.map((msg) => {
          const isOwn = msg.uid === user.uid;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`chat-message ${isOwn ? "own-message" : "other-message"}`}
            >
              {!isOwn && <div className="chat-username">{msg.userName}</div>}
              {msg.text}
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className="group-chat-form" onSubmit={sendMessage}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="group-chat-input"
        />
        <button type="submit" className="group-chat-send-btn">
          <Send size={18} /> Send
        </button>
      </form>
    </div>
  );
}

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
import "../css/Group.css";

export default function GroupChat({ groupId, groupName, onBack }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef();

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

    // Cursor automatically input me aa jayega
    inputRef.current?.focus();
  };

  return (
    <div className="group-chat-container">
      <div className="group-chat-header">
        <button
          onClick={onBack}
          className="back-btn"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="group-chat-title">{groupName} 💬</h2>
      </div>

      <div className="group-chat-messages">

        {messages.length === 0 && (
          <p className="empty-chat">
            No messages yet 👋
            <br />
            Start the conversation.
          </p>
        )}

        {messages.map((msg) => {
          const isOwn = msg.uid === user.uid;

          return (
            <motion.div
              key={msg.id}
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
          ref={inputRef}

          // setText("");
          // inputRef.current?.focus();
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
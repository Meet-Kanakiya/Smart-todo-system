// src/components/Notes.jsx

import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resources, setResources] = useState([]);

  // 🔹 Load all resources (notes) from Firestore
  const fetchResources = async () => {
    const q = query(collection(db, "resources"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setResources(data);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // 🔹 Handle file upload + Firestore entry
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please fill in all fields!");
      return;
    }

    setUploading(true);

    try {
      let fileURL = "";

      // If user selected a file, upload to Firebase Storage
      if (file) {
        const storageRef = ref(
          storage,
          `resources/${Date.now()}_${file.name}`
        );
        await uploadBytes(storageRef, file);
        fileURL = await getDownloadURL(storageRef);
      }

      // Save data to Firestore
      await addDoc(collection(db, "resources"), {
        title,
        description,
        fileURL,
        fileName: file ? file.name : null,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      setUploading(false);

      // Reload list
      fetchResources();

      alert("✅ Note uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
      alert("❌ Failed to upload note.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📚 Resource Sharing Hub</h2>

      <form onSubmit={handleUpload} style={styles.form}>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.fileInput}
        />

        <button type="submit" style={styles.button} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Note"}
        </button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h3 style={styles.subHeading}>🗂 Uploaded Notes</h3>
      {resources.length === 0 ? (
        <p>No notes uploaded yet — add one!</p>
      ) : (
        <ul style={styles.list}>
          {resources.map((res) => (
            <li key={res.id} style={styles.listItem}>
              <h4>{res.title}</h4>
              <p>{res.description}</p>
              {res.fileURL && (
                <a href={res.fileURL} target="_blank" rel="noopener noreferrer">
                  📎 View File
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  heading: { fontSize: "24px", fontWeight: "700", color: "#2563eb" },
  form: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
    resize: "vertical",
  },
  fileInput: { padding: "5px" },
  button: {
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  subHeading: { fontSize: "20px", fontWeight: "600", marginBottom: "10px" },
  list: { listStyleType: "none", padding: 0 },
  listItem: {
    background: "#f9fafb",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "10px",
  },
};

export default Notes;

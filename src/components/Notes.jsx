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

  // Allowed file types
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  // FETCH NOTES
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

  // UPLOAD HANDLER
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      return alert("Please fill all fields");
    }

    if (file && !allowedTypes.includes(file.type)) {
      return alert("Only PDF or Images allowed!");
    }

    setUploading(true);

    try {
      let fileURL = "";

      // Upload file to Firebase Storage
      if (file) {
        const storageRef = ref(
          storage,
          `resources/${Date.now()}_${file.name}`
        );

        await uploadBytes(storageRef, file);
        fileURL = await getDownloadURL(storageRef);
      }

      // Save metadata to Firestore
      await addDoc(collection(db, "resources"), {
        title,
        description,
        fileURL,
        fileName: file ? file.name : null,
        fileType: file ? file.type : null,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);

      fetchResources();
      alert("✅ Note uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    }

    setUploading(false);
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: "clamp(12px,4vw,28px)",
        fontFamily: "Segoe UI",
      }}
    >
      {/* TITLE */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "clamp(22px,4vw,28px)",
          color: "#2563eb",
        }}
      >
        📚 Resource Sharing Hub
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleUpload}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 20,
          background: "#fff",
          padding: "clamp(14px,3vw,22px)",
          borderRadius: 14,
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        }}
      >
        <input
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, minHeight: 100 }}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ padding: 6 }}
        />

        <button style={buttonStyle} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Note"}
        </button>
      </form>

      {/* LIST */}
      <h3 style={{ marginTop: 30 }}>🗂 Uploaded Notes</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 15,
          marginTop: 15,
        }}
      >
        {resources.map((res) => (
          <div
            key={res.id}
            style={{
              background: "#f9fafb",
              padding: 16,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <h4>{res.title}</h4>
            <p style={{ fontSize: 14, color: "#555" }}>
              {res.description}
            </p>

            {/* IMAGE PREVIEW */}
            {res.fileURL && res.fileType?.startsWith("image") && (
              <img
                src={res.fileURL}
                alt="uploaded"
                style={{
                  width: "100%",
                  marginTop: 10,
                  borderRadius: 8,
                }}
              />
            )}

            {/* PDF PREVIEW */}
            {res.fileURL && res.fileType === "application/pdf" && (
              <iframe
                src={res.fileURL}
                title="pdf"
                style={{
                  width: "100%",
                  height: 200,
                  marginTop: 10,
                  border: "none",
                }}
              />
            )}

            {/* FILE LINK */}
            {res.fileURL && (
              <a
                href={res.fileURL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  color: "#2563eb",
                  fontWeight: 600,
                }}
              >
                📎 Open File
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// STYLES
const inputStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 16,
  width: "100%",
};

const buttonStyle = {
  padding: 12,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
};

export default Notes; 
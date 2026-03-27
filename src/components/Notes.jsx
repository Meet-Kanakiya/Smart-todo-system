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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert("Please fill all fields");

    setUploading(true);
    try {
      let fileURL = "";
      if (file) {
        const storageRef = ref(storage, `resources/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        fileURL = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "resources"), {
        title,
        description,
        fileURL,
        fileName: file ? file.name : null,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      setFile(null);
      fetchResources();
      alert("✅ Note uploaded!");
    } catch (err) {
      alert("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div style={{
      maxWidth: 900,
      margin: "auto",
      padding: "clamp(12px,4vw,28px)",
      fontFamily: "Segoe UI"
    }}>
      <h2 style={{
        textAlign:"center",
        fontSize:"clamp(22px,4vw,28px)",
        color:"#2563eb"
      }}>📚 Resource Sharing Hub</h2>

      {/* FORM */}
      <form onSubmit={handleUpload} style={{
        display:"flex",
        flexDirection:"column",
        gap:12,
        marginTop:20,
        background:"#fff",
        padding:"clamp(14px,3vw,22px)",
        borderRadius:14,
        boxShadow:"0 4px 14px rgba(0,0,0,0.08)"
      }}>
        <input
          placeholder="Enter title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          style={{...inputStyle, minHeight:100}}
        />

        <input type="file"
          onChange={(e)=>setFile(e.target.files[0])}
          style={{padding:6}}
        />

        <button style={buttonStyle} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Note"}
        </button>
      </form>

      {/* LIST */}
      <h3 style={{marginTop:30}}>🗂 Uploaded Notes</h3>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
        gap:15,
        marginTop:15
      }}>
        {resources.map(res=>(
          <div key={res.id} style={{
            background:"#f9fafb",
            padding:16,
            borderRadius:12,
            boxShadow:"0 2px 8px rgba(0,0,0,0.06)"
          }}>
            <h4>{res.title}</h4>
            <p style={{fontSize:14,color:"#555"}}>{res.description}</p>

            {res.fileURL && (
              <a href={res.fileURL} target="_blank" rel="noreferrer"
                style={{
                  display:"inline-block",
                  marginTop:8,
                  color:"#2563eb",
                  fontWeight:600
                }}>
                📎 View File
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const inputStyle = {
  padding:12,
  borderRadius:8,
  border:"1px solid #ddd",
  fontSize:16,
  width:"100%"
};

const buttonStyle = {
  padding:12,
  background:"#2563eb",
  color:"#fff",
  border:"none",
  borderRadius:8,
  fontSize:16,
  fontWeight:"bold",
  cursor:"pointer"
};

export default Notes;
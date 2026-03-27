// import React, { useEffect, useState } from "react";
// import { db } from "../firebase";
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   query,
//   orderBy,
//   deleteDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { useAuth } from "../context/AuthContext";
// import { Trash2, Plus } from "lucide-react";
// import "../css/Group.css"; // ✅ use same CSS file

// export default function GroupTasks({ groupId, groupName }) {
//   const { user } = useAuth();
//   const [tasks, setTasks] = useState([]);
//   const [task, setTask] = useState("");

//   useEffect(() => {
//     if (!groupId) return;
//     const q = query(
//       collection(db, "groups", groupId, "tasks"),
//       orderBy("createdAt", "desc")
//     );
//     const unsub = onSnapshot(q, (snap) =>
//       setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
//     );
//     return () => unsub();
//   }, [groupId]);

//   const addTask = async (e) => {
//     e.preventDefault();
//     if (!task.trim()) return;
//     await addDoc(collection(db, "groups", groupId, "tasks"), {
//       task,
//       createdBy: user.displayName || user.email,
//       createdAt: serverTimestamp(),
//     });
//     setTask("");
//   };

//   const removeTask = async (id) => {
//     await deleteDoc(doc(db, "groups", groupId, "tasks", id));
//   };

//   return (
//     <div className="group-tasks-container">
//       <h2 className="group-tasks-title">📝 {groupName} - Shared Tasks</h2>

//       <form className="group-tasks-form" onSubmit={addTask}>
//         <input
//           value={task}
//           onChange={(e) => setTask(e.target.value)}
//           placeholder="Enter a new task..."
//           className="group-tasks-input"
//         />
//         <button type="submit" className="group-tasks-add-btn">
//           <Plus size={16} /> Add
//         </button>
//       </form>

//       <ul className="group-tasks-list">
//         {tasks.length === 0 ? (
//           <p className="no-tasks">No tasks yet — add one above!</p>
//         ) : (
//           tasks.map((t) => (
//             <li key={t.id} className="group-task-item">
//               <span className="task-text">{t.task}</span>
//               <div className="task-meta">
//                 <small className="task-createdby">by {t.createdBy}</small>
//                 <button
//                   onClick={() => removeTask(t.id)}
//                   className="task-delete-btn"
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Trash2, Plus } from "lucide-react";
import "../css/Group.css";

export default function GroupTasks({ groupId, groupName }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    if (!groupId) return;
    const q = query(
      collection(db, "groups", groupId, "tasks"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) =>
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, [groupId]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    await addDoc(collection(db, "groups", groupId, "tasks"), {
      task,
      createdBy: user.displayName || user.email,
      createdAt: serverTimestamp(),
    });
    setTask("");
  };

  const removeTask = async (id) => {
    await deleteDoc(doc(db, "groups", groupId, "tasks", id));
  };

  return (
    <div className="group-tasks-container">
      <h2 className="group-tasks-title">📝 {groupName} - Shared Tasks</h2>

      <form className="group-tasks-form" onSubmit={addTask}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a new task..."
          className="group-tasks-input"
        />
        <button type="submit" className="group-tasks-add-btn">
          <Plus size={16} /> Add
        </button>
      </form>

      <ul className="group-tasks-list">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet — add one above!</p>
        ) : (
          tasks.map((t) => (
            <li key={t.id} className="group-task-item">
              <span className="task-text">{t.task}</span>
              <div className="task-meta">
                <small className="task-createdby">by {t.createdBy}</small>
                <button
                  onClick={() => removeTask(t.id)}
                  className="task-delete-btn"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
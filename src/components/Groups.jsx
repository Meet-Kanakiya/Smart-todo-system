import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import GroupChat from "./GroupChat";
import bcrypt from "bcryptjs";
import Swal from "sweetalert2";
import "../css/Group.css"; // ✅ external CSS for better control

// --- Group Card Component ---
const GroupCard = ({ group, onSelect, onJoin, isMember }) => {
  return (
    <div
      className="group-card"
      onClick={() =>
        isMember ? onSelect(group) : onJoin(group.id, group.members, group.password)
      }
    >
      <div>
        <h3>{group.name}</h3>
        <p id="member-count" >👥 {group.members?.length || 0} members</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          isMember ? onSelect(group) : onJoin(group.id, group.members, group.password);
        }}
        className={isMember ? "enter-btn" : "join-btn"}
      >
        {isMember ? "Enter" : "Join"}
      </button>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "groups"));
    const unsub = onSnapshot(q, (snap) =>
      setGroups(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  const createGroup = async (e) => {
    e.preventDefault();
    if (!name || !password || !user)
      return Swal.fire("Error", "Please enter group name and password.", "error");

    const hashedPassword = await bcrypt.hash(password, 10);

    await addDoc(collection(db, "groups"), {
      name,
      members: [user.uid],
      creatorId: user.uid,
      createdAt: new Date(),
      password: hashedPassword,
    });

    setName("");
    setPassword("");

    Swal.fire("Success", "Group created successfully 🎉", "success");
  };

  const joinGroup = async (id, members, hashedPassword) => {
    if (!user) return;
    if (members.includes(user.uid))
      return Swal.fire("Notice", "You're already in this group.", "info");

    const { value: enteredPassword } = await Swal.fire({
      title: "Enter Group Password 🔒",
      input: "password",
      inputPlaceholder: "Enter password...",
      showCancelButton: true,
      confirmButtonText: "Join Group",
      confirmButtonColor: "#28a745",
    });

    if (!enteredPassword) return;

    const match = await bcrypt.compare(enteredPassword, hashedPassword);
    if (!match) {
      Swal.fire("Incorrect", "❌ Wrong password!", "error");
      return;
    }

    try {
      await updateDoc(doc(db, "groups", id), {
        members: arrayUnion(user.uid),
      });
      Swal.fire("Joined!", "Welcome to the group 🎉", "success");
    } catch (error) {
      console.error("Error joining group: ", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  if (selectedGroup) {
    return <GroupChat groupId={selectedGroup.id} groupName={selectedGroup.name} />;
  }

  return (
    <div className="groups-container">
      <h2>Create or Join Groups</h2>

      {/* Create Group Form */}
      <form className="create-group-form" onSubmit={createGroup}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter group name..."
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Set group password..."
        />
        <button type="submit">+ Create Group</button>
      </form>

      {/* Groups List */}
      <h2>My Groups & Available Groups</h2>
      <div className="groups-list">
        {groups.length === 0 ? (
          <p className="no-groups">No study groups found. Create one!</p>
        ) : (
          groups.map((g) => {
            const isMember = g.members?.includes(user?.uid);
            return (
              <GroupCard
                key={g.id}
                group={g}
                onSelect={setSelectedGroup}
                onJoin={joinGroup}
                isMember={isMember}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

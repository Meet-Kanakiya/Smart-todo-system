import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import {
  PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import '../css/Analytics.css';

const THEME_COLORS = {
  primary: '#3498db',     // Blue (Pending)
  secondary: '#2ecc71',   // Green (Completed)
  bar: '#9b59b6',         // Purple
  neutralBg: '#f8f9fa',   // Background
  cardBg: '#ffffff',      // Card Background
  text: '#34495e',        // Text
  grid: '#ecf0f1',        // Grid lines
  accent: '#2563eb',      // Accent Blue
};

const fullDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getDayDistributionData = (timetableEntries) => {
  const counts = {};
  fullDays.forEach(day => counts[day] = 0);
  timetableEntries.forEach(entry => {
    if (counts.hasOwnProperty(entry.day)) counts[entry.day]++;
  });
  return fullDays.map(day => ({ day, taskCount: counts[day] }));
};

export default function Analytics() {
  const { user } = useAuth();
  const [taskCounts, setTaskCounts] = useState({ todo: 0, done: 0, total: 0 });
  const [plannerDayData, setPlannerDayData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const tasksQuery = query(collection(db, "users", user.uid, "tasks"));
    const unsubTasks = onSnapshot(tasksQuery, snap => {
      const allTasks = snap.docs.map(d => d.data());
      const todo = allTasks.filter(a => a.status === 'todo').length;
      const done = allTasks.filter(a => a.status === 'done').length;
      setTaskCounts({ todo, done, total: todo + done });
    });

    const plannerQuery = query(collection(db, "users", user.uid, "timetable"));
    const unsubPlanner = onSnapshot(plannerQuery, snap => {
      const allEntries = snap.docs.map(d => d.data());
      setPlannerDayData(getDayDistributionData(allEntries));
    });

    return () => { unsubTasks(); unsubPlanner(); };
  }, [user]);

  const pieData = [
    { name: 'Pending', value: taskCounts.todo, color: THEME_COLORS.primary },
    { name: 'Completed', value: taskCounts.done, color: THEME_COLORS.secondary },
  ];

  return (
    <div className="analytics-container">
      <h2 className="analytics-header">📊 Task & Planner Analytics Dashboard</h2>

      <div className="stats-container">
        <StatCard title="Total Tasks" value={taskCounts.total} color={THEME_COLORS.text} />
        <StatCard title="Pending Tasks" value={taskCounts.todo} color={THEME_COLORS.primary} />
        <StatCard title="Completed Tasks" value={taskCounts.done} color={THEME_COLORS.secondary} />
        <StatCard
          title="Planner Entries"
          value={plannerDayData.reduce((s, i) => s + i.taskCount, 0)}
          color={THEME_COLORS.accent}
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">TodoList Status Breakdown</h3>
          {taskCounts.total === 0 ? (
            <p className="empty-chart">No tasks added yet!</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  labelLine={false}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: THEME_COLORS.cardBg, border: '1px solid #ddd' }}
                  formatter={(v) => [`${v} tasks`, 'Count']}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Weekly Planner Task Distribution</h3>
          {plannerDayData.length === 0 ? (
            <p className="empty-chart">No planner entries!</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={plannerDayData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.grid} vertical={false} />
                <XAxis dataKey="day" stroke={THEME_COLORS.text} tickLine={false} />
                <YAxis stroke={THEME_COLORS.text} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(155, 89, 182, 0.1)' }}
                  contentStyle={{ backgroundColor: THEME_COLORS.cardBg, border: '1px solid #ddd' }}
                  formatter={(v) => [`${v} tasks`, 'Scheduled']}
                />
                <Bar dataKey="taskCount" fill={THEME_COLORS.bar} radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, color }) => (
  <div className="stat-card" style={{ borderLeft: `5px solid ${color}` }}>
    <div className="stat-title">{title}</div>
    <div className="stat-value">{value}</div>
  </div>
);

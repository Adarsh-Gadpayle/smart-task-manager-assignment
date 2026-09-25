'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTasks, getUsers, deleteTask, completeTask } from "../../services/api";
import TaskForm from "../../components/TaskForm";
import TaskCard from "../../components/TaskCard";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("all");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [taskData, userData] = await Promise.all([getTasks(), getUsers()]);
      setTasks(taskData.tasks);
      setUsers(userData.users);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem("taskManagerUser");
    if (!stored) {
      router.replace("/login");
      return;
    }
    setUser(JSON.parse(stored));
    load();
  }, [router]);

  async function remove(id) {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function complete(id) {
    try {
      await completeTask(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const visibleTasks = tasks.filter((task) => {
    const priorityMatches = filter === "All" || task.priority === filter;
    const viewMatches =
      view === "all" ||
      (view === "mine" && task.assignedUserId === user?.id) ||
      (view === "blocked" && task.isBlocked && task.status !== "Done");
    return priorityMatches && viewMatches;
  });

  if (!user) return null;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Smart Task Manager</h1>
          <span className="muted">Welcome, {user.name}</span>
        </div>
        <button
          className="secondary"
          onClick={() => {
            localStorage.removeItem("taskManagerUser");
            router.push("/login");
          }}
        >
          Logout
        </button>
      </header>

      <section className="stats">
        <div className="stat"><strong>{tasks.length}</strong><span>Total Tasks</span></div>
        <div className="stat"><strong>{tasks.filter(t => t.status === "Done").length}</strong><span>Completed</span></div>
        <div className="stat"><strong>{tasks.filter(t => t.isBlocked && t.status !== "Done").length}</strong><span>Blocked</span></div>
        <div className="stat"><strong>{users.length}</strong><span>Users</span></div>
      </section>

      {error && <div className="error page-error">{error}</div>}

      <section className="toolbar">
        <div className="tabs">
          <button className={view === "all" ? "tab active" : "tab"} onClick={() => setView("all")}>All Tasks</button>
          <button className={view === "mine" ? "tab active" : "tab"} onClick={() => setView("mine")}>My Tasks</button>
          <button className={view === "blocked" ? "tab active" : "tab"} onClick={() => setView("blocked")}>Blocked</button>
        </div>

        <div className="toolbar-right">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button className="primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            + New Task
          </button>
        </div>
      </section>

      {showForm && (
        <TaskForm
          task={editing}
          users={users}
          tasks={tasks}
          onSaved={() => { setShowForm(false); setEditing(null); load(); }}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <section className="task-grid">
        {visibleTasks.length === 0 ? (
          <div className="empty">No tasks match the selected filters.</div>
        ) : (
          visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => { setEditing(task); setShowForm(true); }}
              onDelete={() => remove(task.id)}
              onComplete={() => complete(task.id)}
            />
          ))
        )}
      </section>
    </main>
  );
}

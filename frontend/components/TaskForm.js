'use client';

import { useEffect, useState } from "react";
import { createTask, updateTask } from "../services/api";

const empty = {
  title: "",
  description: "",
  priority: "Medium",
  status: "To Do",
  assignedUserId: "",
  dependencyIds: []
};

export default function TaskForm({ task, users, tasks, onSaved, onCancel }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedUserId: task.assignedUserId || "",
        dependencyIds: task.dependencyIds || []
      });
    } else {
      setForm(empty);
    }
  }, [task]);

  function update(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  function toggleDependency(id) {
    setForm((old) => ({
      ...old,
      dependencyIds: old.dependencyIds.includes(id)
        ? old.dependencyIds.filter((item) => item !== id)
        : [...old.dependencyIds, id]
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (task) {
        await updateTask(task.id, form);
      } else {
        await createTask(form);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <form className="task-form modal" onSubmit={submit}>
        <div className="modal-head">
          <h2>{task ? "Edit Task" : "Create Task"}</h2>
          <button type="button" className="icon-button" onClick={onCancel}>×</button>
        </div>

        <label>Title</label>
        <input value={form.title} onChange={(e) => update("title", e.target.value)} required />

        <label>Description</label>
        <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows="4" />

        <div className="form-grid">
          <div>
            <label>Priority</label>
            <select value={form.priority} onChange={(e) => update("priority", e.target.value)}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={form.status} onChange={(e) => update("status", e.target.value)}>
              <option>To Do</option><option>In Progress</option><option>Done</option>
            </select>
          </div>
        </div>

        <label>Assign User</label>
        <select value={form.assignedUserId} onChange={(e) => update("assignedUserId", e.target.value)}>
          <option value="">Unassigned</option>
          {users.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}
        </select>

        <label>Dependencies</label>
        <div className="dependency-picker">
          {tasks.filter((item) => item.id !== task?.id).map((item) => (
            <label className="check-row" key={item.id}>
              <input
                type="checkbox"
                checked={form.dependencyIds.includes(item.id)}
                onChange={() => toggleDependency(item.id)}
              />
              {item.title} <span className="muted">({item.status})</span>
            </label>
          ))}
          {tasks.filter((item) => item.id !== task?.id).length === 0 && (
            <span className="muted">No other tasks available.</span>
          )}
        </div>

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
          <button className="primary" disabled={saving}>{saving ? "Saving..." : "Save Task"}</button>
        </div>
      </form>
    </div>
  );
}

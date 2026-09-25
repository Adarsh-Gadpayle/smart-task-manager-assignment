'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      await registerUser(form);
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Create User</h1>
        <p className="muted">Register a new task manager user.</p>

        <label>Name</label>
        <input value={form.name} onChange={(e) => update("name", e.target.value)} required />

        <label>Email</label>
        <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />

        <label>Password</label>
        <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />

        {error && <div className="error">{error}</div>}

        <button className="primary full">Create User</button>
        <p className="switch-link">Already registered? <a href="/login">Login</a></p>
      </form>
    </main>
  );
}

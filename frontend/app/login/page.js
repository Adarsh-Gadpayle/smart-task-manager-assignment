'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("alice@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login({ email, password });
      localStorage.setItem("taskManagerUser", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Smart Task Manager</h1>
        <p className="muted">Sign in to manage your tasks.</p>

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

        <label>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

        {error && <div className="error">{error}</div>}

        <button className="primary full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="switch-link">
          New user? <a href="/register">Create an account</a>
        </p>

        <div className="demo-box">
          Demo: <strong>alice@example.com</strong> / <strong>password</strong>
        </div>
      </form>
    </main>
  );
}

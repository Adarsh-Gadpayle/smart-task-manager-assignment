const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export const login = (body) =>
  request("/users/login", { method: "POST", body: JSON.stringify(body) });

export const registerUser = (body) =>
  request("/users/register", { method: "POST", body: JSON.stringify(body) });

export const getUsers = () => request("/users");

export const getTasks = () => request("/tasks");

export const createTask = (body) =>
  request("/tasks", { method: "POST", body: JSON.stringify(body) });

export const updateTask = (id, body) =>
  request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, { method: "DELETE" });

export const completeTask = (id) =>
  request(`/tasks/${id}/complete`, { method: "PATCH" });

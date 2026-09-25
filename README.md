# Smart Task Manager

Full-stack assignment implementation based on the supplied problem statement.

## Stack
- Frontend: Next.js (React)
- Backend: Node.js + Express
- Storage: in-memory Maps
- Mock authentication: no password hashing

## Features
- Create users
- Mock login
- View users
- Create/edit/delete tasks
- Assign users
- Priorities: Low / Medium / High
- Statuses: To Do / In Progress / Done
- Task dependencies
- Prevent completion when dependencies are incomplete
- My Tasks
- Blocked Tasks
- High-priority filtering
- Reusable API service and UI components

## Run

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:5000.

### 2. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000.

The frontend expects the backend at `http://localhost:5000/api`.

## Demo users
The backend starts with:
- Alice / alice@example.com
- Bob / bob@example.com
- Charlie / charlie@example.com

Any email/password combination can log in for an existing user. Registration creates a new user.

## Notes
Data is intentionally stored in memory. Restarting the backend resets all users/tasks.

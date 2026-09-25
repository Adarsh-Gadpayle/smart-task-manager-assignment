const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Smart Task Manager API is running." });
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

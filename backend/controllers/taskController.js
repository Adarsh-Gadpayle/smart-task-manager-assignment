const { tasks, users, getNextTaskId } = require("../data/store");

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["To Do", "In Progress", "Done"];

function enrichTask(task) {
  return {
    ...task,
    assignedUser: task.assignedUserId
      ? [...users.values()].find((u) => u.id === task.assignedUserId)?.name || null
      : null,
    dependencies: task.dependencyIds.map((id) => {
      const dependency = tasks.get(id);
      return dependency
        ? { id: dependency.id, title: dependency.title, status: dependency.status }
        : { id, title: "Unknown task", status: "Unknown" };
    }),
    isBlocked: task.dependencyIds.some((id) => tasks.get(id)?.status !== "Done")
  };
}

function validateTaskBody(body) {
  if (!body.title || !body.title.trim()) return "Title is required.";
  if (!PRIORITIES.includes(body.priority)) return "Priority must be Low, Medium or High.";
  if (!STATUSES.includes(body.status)) return "Invalid status.";
  if (body.assignedUserId && !users.has(body.assignedUserId)) return "Assigned user does not exist.";
  return null;
}

function hasDependencyCycle(taskId, dependencyIds) {
  const visiting = new Set();
  const visited = new Set();

  function dfs(id) {
    if (id === taskId) return true;
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;

    visiting.add(id);
    const task = tasks.get(id);
    if (task) {
      for (const dependencyId of task.dependencyIds) {
        if (dfs(dependencyId)) return true;
      }
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  }

  return dependencyIds.some((id) => dfs(id));
}

function canMarkDone(task) {
  return task.dependencyIds.every((id) => {
    const dependency = tasks.get(id);
    return dependency && dependency.status === "Done";
  });
}

exports.getTasks = (req, res) => {
  let result = [...tasks.values()];

  if (req.query.userId) {
    result = result.filter((task) => task.assignedUserId === req.query.userId);
  }

  if (req.query.priority && PRIORITIES.includes(req.query.priority)) {
    result = result.filter((task) => task.priority === req.query.priority);
  }

  if (req.query.blocked === "true") {
    result = result.filter((task) => !canMarkDone(task) && task.status !== "Done");
  }

  res.json({ tasks: result.map(enrichTask) });
};

exports.getTask = (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });
  res.json({ task: enrichTask(task) });
};

exports.createTask = (req, res) => {
  const body = req.body;
  const validationError = validateTaskBody(body);
  if (validationError) return res.status(400).json({ message: validationError });

  const dependencyIds = Array.isArray(body.dependencyIds) ? [...new Set(body.dependencyIds)] : [];

  if (dependencyIds.some((id) => !tasks.has(id))) {
    return res.status(400).json({ message: "One or more dependencies do not exist." });
  }

  const task = {
    id: getNextTaskId(),
    title: body.title.trim(),
    description: body.description || "",
    priority: body.priority,
    status: body.status || "To Do",
    assignedUserId: body.assignedUserId || null,
    dependencyIds
  };

  if (task.status === "Done" && !canMarkDone(task)) {
    return res.status(400).json({ message: "Task cannot be marked Done until dependencies are complete." });
  }

  tasks.set(task.id, task);
  res.status(201).json({ task: enrichTask(task) });
};

exports.updateTask = (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  const body = req.body;
  const merged = {
    ...task,
    ...body,
    title: body.title !== undefined ? String(body.title).trim() : task.title,
    dependencyIds: Array.isArray(body.dependencyIds)
      ? [...new Set(body.dependencyIds)]
      : task.dependencyIds
  };

  const validationError = validateTaskBody(merged);
  if (validationError) return res.status(400).json({ message: validationError });

  if (merged.dependencyIds.includes(task.id)) {
    return res.status(400).json({ message: "A task cannot depend on itself." });
  }

  if (merged.dependencyIds.some((id) => !tasks.has(id))) {
    return res.status(400).json({ message: "One or more dependencies do not exist." });
  }

  if (hasDependencyCycle(task.id, merged.dependencyIds)) {
    return res.status(400).json({ message: "Dependency cycle detected." });
  }

  if (merged.status === "Done" && !canMarkDone(merged)) {
    return res.status(400).json({ message: "Task cannot be marked Done until dependencies are complete." });
  }

  tasks.set(task.id, merged);
  res.json({ task: enrichTask(merged) });
};

exports.deleteTask = (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  // Keep dependency references valid by preventing deletion when another task depends on it.
  const dependents = [...tasks.values()].filter(
    (item) => item.id !== task.id && item.dependencyIds.includes(task.id)
  );

  if (dependents.length) {
    return res.status(409).json({
      message: "Cannot delete this task because another task depends on it."
    });
  }

  tasks.delete(task.id);
  res.json({ message: "Task deleted successfully." });
};

exports.completeTask = (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  if (!canMarkDone(task)) {
    return res.status(409).json({
      message: "Task is blocked. Complete all dependencies first."
    });
  }

  task.status = "Done";
  res.json({ task: enrichTask(task) });
};

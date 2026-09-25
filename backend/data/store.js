// In-memory data store.
// Maps make lookup/update/delete operations simple and keep this exercise database-free.

const users = new Map();
const tasks = new Map();

let nextUserId = 4;
let nextTaskId = 4;

function seed() {
  users.set("1", {
    id: "1",
    name: "Darshana",
    email: "10darshanazade@gmail.com",
    password: "Darshana@2004"
  });

  users.set("2", {
    id: "2",
    name: "Ayush Dhole",
    email: "darkplayindia@2003",
    password: "Ayush@2003"
  });

  users.set("3", {
    id: "3",
    name: "Piyush Rangari",
    email: "piyushrangari005@gmail.com",
    password: "Pass@1234"
  });

  tasks.set("1", {
    id: "1",
    title: "Design dashboard",
    description: "Create the dashboard layout.",
    priority: "High",
    status: "Done",
    assignedUserId: "1",
    dependencyIds: []
  });

  tasks.set("2", {
    id: "2",
    title: "Implement dashboard",
    description: "Build dashboard UI and API integration.",
    priority: "High",
    status: "In Progress",
    assignedUserId: "2",
    dependencyIds: ["1"]
  });

  tasks.set("3", {
    id: "3",
    title: "Write documentation",
    description: "Prepare project documentation.",
    priority: "Medium",
    status: "To Do",
    assignedUserId: "2",
    dependencyIds: ["2"]
  });
}

seed();

function publicUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function getNextUserId() {
  return String(nextUserId++);
}

function getNextTaskId() {
  return String(nextTaskId++);
}

module.exports = {
  users,
  tasks,
  publicUser,
  getNextUserId,
  getNextTaskId
};

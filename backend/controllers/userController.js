const { users, publicUser, getNextUserId } = require("../data/store");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  for (const user of users.values()) {
    if (user.email === normalizedEmail) {
      return res.status(409).json({ message: "Email is already registered." });
    }
  }

  const user = {
    id: getNextUserId(),
    name: name.trim(),
    email: normalizedEmail,
    password
  };

  users.set(user.id, user);
  res.status(201).json({ user: publicUser(user) });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = [...users.values()].find(
    (item) => item.email === String(email || "").trim().toLowerCase()
  );

  // Mock authentication: no hashing/session/JWT is required by the assignment.
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({ user: publicUser(user) });
};

exports.getUsers = (req, res) => {
  res.json({ users: [...users.values()].map(publicUser) });
};

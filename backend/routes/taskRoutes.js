const express = require("express");
const router = express.Router();
const controller = require("../controllers/taskController");

router.get("/", controller.getTasks);
router.get("/:id", controller.getTask);
router.post("/", controller.createTask);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);
router.patch("/:id/complete", controller.completeTask);

module.exports = router;

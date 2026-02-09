import express from "express";
import Task from "../models/task.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new task
router.post("/", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user.id,
  });

  await task.save();
  res.json(task);
});

// Get tasks assigned to logged-in user
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ owner: req.user.id });
  res.json(tasks);
});

// Update a task (by creator only)
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).send("Task not found");

  if (task.createdBy.toString() !== req.user.id) {
    return res.status(403).send("You are not authorized to update this task");
  }

  Object.assign(task, req.body);
  await task.save();
  res.json(task);
});

// Delete a task (by creator only)
router.delete("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).send("Task not found");

  if (task.createdBy.toString() !== req.user.id) {
    return res.status(403).send("You are not authorized to delete this task");
  }

  await task.deleteOne();
  res.json(task);
});

export default router;

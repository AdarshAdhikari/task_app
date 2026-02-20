import express from "express";
import Task from "../models/task.js";
import auth from "../middleware/authMiddleware.js";
import crypto from "crypto";

const router = express.Router(); 

/**
 * CREATE TASK
 * Sender assigns task to receivers
 */
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, receivers } = req.body;

    const generatedTaskId =
      "TASK-" + crypto.randomBytes(3).toString("hex").toUpperCase();

    const task = new Task({
      taskId: generatedTaskId,
      title,
      description,
      sender: req.user.id,
      receivers,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * GET MY TASKS
 * Sender OR Receiver can see
 */
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

   const sentTasks = await Task.find({ sender: userId })
  .populate("receivers", "name email");

const receivedTasks = await Task.find({ receivers: userId })
  .populate("sender", "name email");
    res.json({
      sent: sentTasks,
      received: receivedTasks,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/**
 * UPDATE TASK
 * Sender or Receiver allowed
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const userId = req.user.id;

    const isSender = task.sender.toString() === userId;
    const isReceiver = task.receivers.includes(userId);

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Receivers should not modify ownership
    delete req.body.sender;
    delete req.body.receivers;

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * DELETE TASK
 * Sender ONLY
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only sender can delete" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
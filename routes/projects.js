const express = require("express");
const Project = require("../models/project");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create project
router.post("/", auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      createdBy: req.user.id
    });

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).send("Error creating project");
  }
});

// Get all user projects
router.get("/", auth, async (req, res) => {
  const projects = await Project.find({ createdBy: req.user.id });
  res.json(projects);
});

// Add task
router.post("/:id/tasks", auth, async (req, res) => {
  const project = await Project.findById(req.params.id);
  project.tasks.push(req.body);
  await project.save();
  res.json(project);
});

// Update task completion (better way)
router.put("/:projectId/task/:taskId", auth, async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  const task = project.tasks.id(req.params.taskId);
  task.completed = req.body.completed;
  await project.save();
  res.json(task);
});

// Progress API
router.get("/:id/progress", auth, async (req, res) => {
  const project = await Project.findById(req.params.id);
  const total = project.tasks.length;
  const completed = project.tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  res.json({ total, completed, percent });
});

// Delete project

router.delete("/:id", auth, async (req, res) => {
  try {
    console.log("DELETE PROJECT ID:", req.params.id);
    console.log("LOGGED USER ID:", req.user.id);

    const project = await Project.findById(req.params.id);

    if (!project) {
      console.log("PROJECT NOT FOUND");
      return res.status(404).send("Project not found");
    }

    console.log("PROJECT OWNER:", project.createdBy.toString());

    if (project.createdBy.toString() !== req.user.id) {
      console.log("NOT AUTHORIZED");
      return res.status(403).send("Not authorized");
    }

    await project.deleteOne();
    console.log("PROJECT DELETED");

    res.send("Project deleted successfully");
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).send("Error deleting project");
  }
});



module.exports = router;

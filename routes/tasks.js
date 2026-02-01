const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/authMiddleware');


const router = express.Router();

// Create a new task
 router.post('/', auth,async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    await task.save();
    res.json(task);
});

//Get tasks assigned to looged user

router.get('/', auth, async (req, res) => {
    const tasks = await Task.find({owner: req.user._id});
    res.json(tasks);
});

// Update a task(by creater only)

router.put('/:id', auth, async (req, res) => {
    const task = await Task.findById(req.params.id);

    if(task.createdBy.toString() !== req.user._id)
        return res.status(403).send("You are not authorized to update this task");

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
});

// Delete a task(by creater only)

router.delete('/:id', auth, async (req, res) => {
    const task = await Task.findById(req.params.id);    

    if(task.createdBy.toString() !== req.user._id)
        return res.status(403).send("You are not authorized to delete this task");

    await task.deleteOne();
    res.json(task);
});

module.exports = router;
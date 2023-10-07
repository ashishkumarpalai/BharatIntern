const express = require("express")
const { TaskModel } = require("../models/task.model")

const taskRouter = express.Router()

// Route for creating a new task
taskRouter.post('/', async (req, res) => {
    try {
        const { title, description, assignedTo, dueDate } = req.body;

        // Create a new task
        const task = new TaskModel({
            title,
            description,
            assignedTo,
            dueDate,
        });

        // Save the task to the database
        await task.save();

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route for getting all tasks
taskRouter.get('/', async (req, res) => {
    try {
        const tasks = await TaskModel.find().populate('assignedTo', 'name'); // Populate the assignedTo field with the username

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route for getting a task by ID
taskRouter.get('/:taskId', async (req, res) => {
    try {
        const task = await TaskModel.findById(req.params.taskId).populate('assignedTo', 'name');

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route for updating a task by ID
taskRouter.put('/:taskId', async (req, res) => {
    try {
        const { title, description, assignedTo, status, dueDate } = req.body;
        const updatedTask = {
            title,
            description,
            assignedTo,
            status,
            dueDate,
        };

        const task = await TaskModel.findByIdAndUpdate(req.params.taskId, updatedTask, {
            new: true, // Return the updated task
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route for deleting a task by ID
taskRouter.delete('/:taskId', async (req, res) => {
    try {
        const task = await TaskModel.findByIdAndRemove(req.params.taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});




module.exports = { taskRouter }
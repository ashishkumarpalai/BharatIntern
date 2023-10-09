const express = require("express")
const { TaskModel } = require("../models/task.model")
const { UserModel } = require("../models/user.model");
const { authenticate } = require("../middleware/auth.middleware");


const taskRouter = express.Router()

// creating a new task
taskRouter.post('/', authenticate, async (req, res) => {
    // console.log(req.body.user)
    try {
        const { title, description, assignedTo, dueDate } = req.body;

        // Check if the title is empty or already exists
        if (!title) {
            return res.status(400).send({ error: 'Title is required' });
        } if (!description) {
            return res.status(400).send({ error: 'description is required' });
        } if (!assignedTo) {
            return res.status(400).send({ error: 'assignedTo is required' });
        } if (!dueDate) {
            return res.status(400).send({ error: 'dueDate is required' });
        }

        // Check if a task with the same title already exists in the database
        const existingTask = await TaskModel.findOne({ title });

        if (existingTask) {
            return res.status(400).send({ error: 'Task with this title already exists' });
        }

        // Create a new task
        const task = new TaskModel({
            title,
            description,
            assignedTo,
            dueDate,
            taskcreator: req.body.user
        });

        // Save the task to the database
        await task.save();


        // Update the user's list of tasks
        const user = await UserModel.findById(assignedTo);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        user.tasks.push(task._id); // Assuming 'tasks' is an array field in the User model to store task IDs
        await user.save();

        res.status(201).send({ message: 'Task Created successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Route for getting all tasks
taskRouter.get('/', authenticate, async (req, res) => {
    try {
        const tasks = await TaskModel.find().populate('assignedTo').populate('taskcreator'); // Populate the assignedTo field with the username .populate('assignedTo', 'email')

        res.send({ message: 'All Task get successfully', tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route for getting a task by ID
taskRouter.get('/:taskId',authenticate, async (req, res) => {
    try {
        const task = await TaskModel.findById(req.params.taskId).populate('assignedTo').populate('taskcreator')

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
taskRouter.put('/:taskId',authenticate, async (req, res) => {
    try {
        const { title, description, assignedTo, status, dueDate } = req.body;

        // Check if a task with the same title already exists in the database
        const existingTask = await TaskModel.findOne({ title });

        if (existingTask && existingTask._id != req.params.taskId) {
            return res.status(400).send({ error: 'Task with this title already exists' });
        }

        // Validate the 'status' field
        const allowedStatusValues = ['open', 'in_progress', 'completed'];
        if (!allowedStatusValues.includes(status)) {
            return res.status(400).send({ error: 'Invalid status value you can put :-[open, in_progress, completed]' });
        }

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

taskRouter.delete('/:taskId',authenticate, async (req, res) => {
    try {
        // Find the task by ID
        const task = await TaskModel.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Retrieve the user associated with the task
        const user = await UserModel.findById(task.assignedTo);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove the task from the user's list of tasks
        user.tasks = user.tasks.filter(taskId => taskId.toString() !== task._id.toString());

        // Save the updated user document
        await user.save();

        // Delete the task using findByIdAndDelete
        await TaskModel.findByIdAndDelete(req.params.taskId);

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = { taskRouter }
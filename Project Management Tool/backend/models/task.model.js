const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to the User model for the user to whom the task is assigned
        required: true,
    },
    taskcreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to the User model for the user to whom the task is assigned
        // required: true,
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'completed'],
        default: 'open',
    },
    dueDate: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const TaskModel = mongoose.model('task', taskSchema);

module.exports = { TaskModel }
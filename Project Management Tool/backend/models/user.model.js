const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // Relationships
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post', // Reference to the Post model for posts created by the user
        },
    ],
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'task', // Reference to the Task model for tasks assigned to the user
        },
    ],
});

const UserModel = mongoose.model("user", userSchema)

module.exports = { UserModel }
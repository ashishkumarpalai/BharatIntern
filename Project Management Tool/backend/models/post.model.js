const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for the author of the post
        required: true,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model for users who liked the post
        },
    ],
    comments: [
        {
            text: String,
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Reference to the User model for the author of the comment
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const PostModel = mongoose.model("post", postSchema)

module.exports = { PostModel }


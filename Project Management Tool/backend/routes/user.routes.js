const express = require("express")
const { UserModel } = require("../models/user.model")
const { TaskModel } = require("../models/task.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { authenticate } = require("../middleware/auth.middleware")

const userRouter = express.Router()

// Get all users with related data (posts and tasks)
userRouter.get("/",authenticate, async (req, res) => {
    try {
        const allUsers = await UserModel.find().populate('tasks');
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ "msg": "Something went wrong", "error": error.message });
    }
});

userRouter.get("/:userId",authenticate, async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await UserModel.findById(userId).populate('tasks'); // Use 'tasks' here if you want to populate tasks for this user
        if (!user) {
            return res.status(404).json({ "msg": "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ "msg": "Something went wrong", "error": error.message });
    }
});

// Register a new user
userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ "msg": "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ "msg": "New user has been registered" });
    } catch (error) {
        res.status(500).json({ "msg": "Something went wrong", "error": error.message });
    }
});

// Login an existing user
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ "msg": "Wrong Credentials" });
        }

        // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ "msg": "Wrong Password" });
        }

        // Create and send a JWT token upon successful login
        const token = jwt.sign({ userID: user._id }, "masai", { expiresIn: "1h" });

        res.status(200).json({ "msg": "Successfully logged in", "token": token, "user": user._id, "name": user.name ,"email": user.email});
    } catch (error) {
        res.status(500).json({ "msg": "Something went wrong", "error": error.message });
    }
});


module.exports = { userRouter }
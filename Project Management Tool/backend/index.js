// Import required libraries and modules
const express = require("express")

require("dotenv").config()
const { connection } = require("./configs/db")
const { userRouter } = require("./routes/user.routes")
const { taskRouter } = require("./routes/task.routes")
const { authenticate } = require("./middleware/auth.middleware")
const { productRouter } = require("./routes/product.routes")
const cors = require("cors")

// Create an Express application
const app = express()

app.use(express.json())
app.use(cors())

// Define a basic route for the root endpoint
app.get("/", async (req, res) => {
    res.send(`<h1 style="text-align: center; color: blue;">Wellcome Project Management bharat intern Assignment</h1>`)
    console.log("Wellcome Content Management Tool")
})

// Use the userRouter for user registration and login
app.use("/user", userRouter)


//use the taskrouter for creating tasks and managing tasks
app.use("/task", taskRouter)
// Use the productRouter for product details
app.use("/product", productRouter)


// Uncomment the next line if you want to add authentication middleware
app.use(authenticate);

// Define another route for testing
app.get("/a", async (req, res) => {
    res.send("wellcome to Ecommerce backend")
    console.log(req.body.user)
})

// Start the server, listen to the specified port
app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("DataBase is connected")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`server is running on port${process.env.port}`)
})
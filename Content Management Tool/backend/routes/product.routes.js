const express = require("express")
const { authenticate } = require("../middleware/auth.middleware");
const { ProductModel } = require("../models/product.model")

const productRouter = express.Router()

//get the all category

productRouter.get("/category", async (req, res) => {
    try {
        let product = await ProductModel.distinct('category');
        res.status(200).send(product)
    } catch (error) {
        res.send({ "error": error.message })
    }
})

// add product data 

productRouter.post('/', authenticate, async (req, res) => {
    try {
        const user = req.body.user

        const { title, image, category, availablity, description } = req.body;

        // Check if a product with the same title already exists
        const existingProduct = await ProductModel.findOne({ title });

        if (existingProduct) {
            // If a product with the same title exists, return an error
            return res.status(400).send({ "error": "Product with the same title already exists." });
        }

        // Create a new product
        const newProduct = new ProductModel({
            title,
            image,
            category,
            availablity,
            description,
            user
        });

        // Save the product to the database
        await newProduct.save();
        res.status(201).send({ "msg": "Product data added successfully" });
    } catch (error) {
        res.status(400).send({ "error": error.message });
    }
});

//get the all products

productRouter.get("/", authenticate, async (req, res) => {
    const user = req.query.user;
    const category = req.query.category;

    try {
        let query = {};

        if (user && category) {
            query = { user: user, category: category };
        } else if (user) {
            query = { user: user };
        } else if (category) {
            query = { category: category };
        }

        let products = await ProductModel.find(query);
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ "error": error.message });
    }
});

//get product by theire id

productRouter.get("/:id", authenticate, async (req, res) => {
    try {
        let product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }
        res.status(200).send(product)
    } catch (error) {
        res.status(400).send({ "error": error.message })
    }
})


// Update a product by ID
productRouter.put('/:id', authenticate, async (req, res) => {
    const user = req.body.user;
    const taskId = req.params.id;
    const { title, description,image } = req.body;
    try {
        const userid = await ProductModel.findById(taskId);
        if (user === userid.user) {
            const updatedTask = await ProductModel.findByIdAndUpdate(
                taskId,
                { title, description,image },
                { new: true }
            );
            if (!updatedTask) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(updatedTask).status(200);
        }else{
            res.send({message:"You are not Authorize for this data"}).Status(204); // No content
        }

        
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

// Delete a product by ID
productRouter.delete('/:id', authenticate, async (req, res) => {
    const user = req.body.user;
    const taskId = req.params.id;
    try {
        const userid = await ProductModel.findById(taskId);
        // console.log(userid.user);
        if (user === userid.user) {
            const deletedTask = await ProductModel.findByIdAndRemove(taskId);
            if (!deletedTask) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.status(200).json({ message: 'product removed successfully' });
        }else{
            res.send({message:"You are not Authorize for this data"}).Status(204); // No content
        }

       
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = { productRouter }
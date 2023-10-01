const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        availablity: {
            type: Boolean,
            default: true
        },
        description:{
            type:String,
            required:true
        } ,
        user:{type:String} 
        
    }
)

const ProductModel = mongoose.model("product", productSchema)

module.exports = { ProductModel }
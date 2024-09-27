// models/Product.js

const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}, { timestamps: true }); // This will add createdAt and updatedAt fields automatically

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

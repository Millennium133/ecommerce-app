// seeder/seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { generateUsers } = require('./data/users');
const { generateProducts } = require('./data/products');
const { generateCarts } = require('./data/carts');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch((err) => console.log(err));

// Function to import sample data
const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Cart.deleteMany();

        // Generate and insert sample users
        const users = generateUsers(50);  // Generate 50 users
        const createdUsers = await User.insertMany(users);

        // Generate and insert sample products
        const products = generateProducts(100);  // Generate 100 products
        const createdProducts = await Product.insertMany(products);

        // Generate and insert sample carts (linking users to products)
        const carts = generateCarts(createdUsers, createdProducts, 30);  // Generate 30 carts
        await Cart.insertMany(carts);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error with Data Import: ', error);
        process.exit(1);
    }
};

// Run the seed script
importData();

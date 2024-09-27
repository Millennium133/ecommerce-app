const Product = require('./models/Product')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({'path': '.env.test'})
mongoose.connect(process.env.MONGO_URI)
console.log(process.env.MONGO_URI)
const product = new Product({ title: 'testProductId', 
    price: 100, 
    description: 'himawari', 
    category: "flower", 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg'});  

const a = async () => {
    const savedProduct = await product.save();
    return  savedProduct
}
const main = async () => {
    const savedObject = await a(); // Await the result of the async function
    console.log('saved object:', savedObject); // Log the saved product object
};

// Execute the main function
main();
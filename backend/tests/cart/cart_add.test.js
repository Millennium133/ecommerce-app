// tests/cart.test.js

const request = require('supertest');
const app = require('../../server.js'); // Path to your server file
const mongoose = require('mongoose');
const User = require("../../models/User.js");
const Cart = require('../../models/Cart.js');
const Product = require('../../models/Product.js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });
console.log(`cart_add.test.js: ${process.env.MONGO_URI}`)

// Mock JWT Middleware for protected routes
jest.mock('../../middleware/authMiddleware', () => ({
    protect: (req, res, next) => {
        req.user = { _id: '507f1f77bcf86cd799439011' }; // Mock authenticated user
        next();
    }
}));

// Mock mongoose model methods for isolation
jest.mock('../../models/Cart');
jest.mock('../../models/Product');

describe('Cart API Tests', () => {
    const authToken = 'Bearer mockToken';

    // Connect to the test database before running the tests
    beforeAll(async () => {
        const dbName = `db_cart`;
        await mongoose.connect(`${process.env.MONGO_URI}_${dbName}`);

    });

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });
    

    // Clean up the database and mocks after each test
    // afterEach(async () => {
    //     await User.deleteMany();
    // });

    // Disconnect from the database after all tests
    afterAll(async () => {
        jest.resetModules(); // Ensures all mocks are restored to their original state
        await mongoose.connection.close();
    });

    // Utility function to add a product to the cart
    const addProductToCart = (productId, quantity) => {
        return request(app)
            .put('/api/cart')
            .send({ productId, quantity })
            .set('Authorization', authToken);
    };

    test('Add product to cart with valid quantity', async () => {
        const objectId = new mongoose.Types.ObjectId();
        
        const product = { 
            _id: objectId,
            title: 'Test Product',
            price: 100, 
            description: 'himawari', 
            category: "flower", 
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg'
        };

        Product.findById.mockResolvedValue(product);
        Cart.findOne.mockResolvedValue({ items: [], totalAmount: 0, save: jest.fn() });

        const response = await addProductToCart(product._id, 3);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('items');
        expect(response.body.items[0].quantity).toBe(3);
    });

    test('Prevent adding product with invalid quantity (less than 1)', async () => {
        const objectId = new mongoose.Types.ObjectId();

        const product = { 
            _id: objectId,
            title: 'Test Product', 
            price: 100, 
            description: 'himawari', 
            category: "flower", 
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg'
        };
        
        Product.findById.mockResolvedValue(product);
        const response = await addProductToCart(product._id, 0); // Invalid quantity

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Quantity must be an integer and at least 1');
    });

    test('Prevent adding product with non-integer quantity', async () => {
        const objectId = new mongoose.Types.ObjectId();
 
        const product = { 
            _id: objectId,
            title: 'Test Product', 
            price: 100, 
            description: 'himawari', 
            category: "flower", 
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg'
        };

        Product.findById.mockResolvedValue(product);
        const response = await addProductToCart(product._id, 'abc'); // Invalid quantity

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Quantity must be an integer and at least 1');
    });

    test('Error when product does not exist', async () => {
        Product.findById.mockResolvedValue(null); // Mock product not found

        const response = await addProductToCart('nonExistingProductId', 2); 

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Product not found');
    });
});


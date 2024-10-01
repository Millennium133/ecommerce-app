// tests/cart.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); // Your Express server
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

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

describe('Cart API Remove Product Tests', () => {
    const authToken = 'Bearer mockToken';

    // Connect to the test database before running the tests
    beforeAll(async () => {
        const dbName = `db_cart`;
        await mongoose.connect(`${process.env.MONGO_URI}_${dbName}`);
    });

    // Clean up the database and mocks after each test
    afterEach(async () => {
        jest.clearAllMocks(); // Clear mocks between tests
    });

    // Disconnect from the database after all tests
    afterAll(async () => {
        jest.restoreAllMocks(); // Restores the original implementation of all mocked modules
        await mongoose.connection.close();
    });

    test('Remove a product that exists in the cart', async () => {
        const product = { _id: new mongoose.Types.ObjectId(), title: 'Test Product', price: 100 };
        const cart = {
            userId: 'testUserId',
            items: [{ productId: product._id, quantity: 2 }],
            totalAmount: 200,
            save: jest.fn()
        };

        Product.findById.mockResolvedValue(product);
        Cart.findOne.mockResolvedValue(cart);

        const response = await request(app)
            .delete(`/api/cart/remove/${product._id}`)
            .set('Authorization', authToken);

        expect(response.statusCode).toBe(200);
        expect(response.body.items.length).toBe(0);
        expect(cart.save).toHaveBeenCalled();
    });

    test('Try to remove a product that is not in the cart', async () => {
        const productId = new mongoose.Types.ObjectId() 
        const product = { _id: productId, title: 'Test Product', price: 100 };
        const cart = {
            userId: 'testUserId',
            items: [{ productId: new mongoose.Types.ObjectId(), quantity: 2 }], // Different productId
            totalAmount: 200,
            save: jest.fn()
        };

        Product.findById.mockResolvedValue(product);
        Cart.findOne.mockResolvedValue(cart);

        const response = await request(app)
            .delete(`/api/cart/remove/${product._id}`)
            .set('Authorization', authToken);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Product not found in cart');
        expect(cart.save).not.toHaveBeenCalled();
    });

    test('Try to remove a product from a cart that does not exist', async () => {
        Product.findById.mockResolvedValue(null); // Product not found in cart
        Cart.findOne.mockResolvedValue(null); // Cart not found

        const response = await request(app)
            .delete(`/api/cart/remove/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', authToken);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Cart not found');
    });

    test('Handle invalid product ID format', async () => {
        const response = await request(app)
            .delete(`/api/cart/remove/invalidProductId`) // Invalid productId format
            .set('Authorization', authToken);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid product ID format');
    });

    test('Handle error during cart save', async () => {
        const product = { _id: new mongoose.Types.ObjectId(), title: 'Test Product', price: 100 };
        const cart = {
            userId: 'testUserId',
            items: [{ productId: product._id, quantity: 2 }],
            totalAmount: 200,
            save: jest.fn().mockRejectedValue(new Error('Save failed')) // Simulate save error
        };

        Product.findById.mockResolvedValue(product);
        Cart.findOne.mockResolvedValue(cart);

        const response = await request(app)
            .delete(`/api/cart/remove/${product._id}`)
            .set('Authorization', authToken);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Error removing product from cart');
    });

    
    test('Clear entire cart', async () => {
        const objectId = new mongoose.Types.ObjectId();

        const product = { 
            _id: objectId,
            title: 'Test Product', 
            price: 100, 
            description: 'himawari', 
            category: "flower", 
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg'
        };

        Cart.findOne.mockResolvedValue({
            userId: 'testUserId',
            items: [{ productId: product._id, quantity: 2 }],
            totalAmount: 200,
            save: jest.fn(),
        });

        const response = await request(app)
            .delete('/api/cart/clear')
            .set('Authorization', authToken);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Cart cleared successfully');
    });
});

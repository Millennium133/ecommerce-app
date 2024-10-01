// tests/cart/cart_concurrent.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });
console.log(`cart_concurrent.js: ${process.env.MONGO_URI}`)

// Mock JWT Middleware for protected routes
jest.mock('../../middleware/authMiddleware', () => ({
    protect: (req, res, next) => {
        req.user = { _id: '507f1f77bcf86cd799439011' };
        next();
    }
}));

describe('Cart API Concurrent Requests Tests', () => {
    const authToken = 'Bearer mockToken';

    beforeAll(async () => {
        const dbName = `db_cart`;
        await mongoose.connect(`${process.env.MONGO_URI}_${dbName}`);
        // await mongoose.connect(`${process.env.MONGO_URI}`);

    });

    afterEach(async () => {
        await Cart.deleteMany();
        await Product.deleteMany();
        jest.clearAllMocks(); 
    });

    afterAll(async () => {
        jest.restoreAllMocks(); // Ensures all mocks are restored to their original state
        await mongoose.connection.close();
    });

    test('Simultaneously add and remove products to/from the cart', async () => {
        const product1 = new Product({ title: 'Product 1', 
            price: 100, 
            description: 'Description 1', 
            category: 'something', 
            imageUrl: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D'
        });
        const product2 = new Product({ title: 'Product 2', 
            price: 150, 
            description: 'Description 2', 
            category: 'something', 
            imageUrl: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D'
        });        
        await product1.save();
        await product2.save();
        // Initial empty cart
        const cart = new Cart({ userId: '507f1f77bcf86cd799439011' , items: [], totalAmount: 0 });
        await cart.save();

        // Concurrently add product1 and remove product2 (non-existent)
        const addProduct1 = request(app)
            .put('/api/cart')
            .send({ productId: product1._id, quantity: 1 })
            .set('Authorization', authToken);

        const removeProduct2 = request(app)
            .delete(`/api/cart/remove/${product2._id}`)
            .set('Authorization', authToken);

        // Execute both requests concurrently
        const [addResponse, removeResponse] = await Promise.all([addProduct1, removeProduct2]);
        expect(addResponse.statusCode).toBe(200);
        expect(addResponse.body.items.length).toBe(1);
        expect(addResponse.body.items[0].productId).toBe(product1._id.toString());
        expect(addResponse.body.totalAmount).toBe(100);

        expect(removeResponse.statusCode).toBe(404);
        expect(removeResponse.body.message).toBe('Product not found in cart');
    });
});

// tests/product/product_get.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); // Adjust to the correct path
const Product = require('../../models/Product');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

describe('Product API Tests', () => {
    beforeAll(async () => {
        const dbName = `db_product_get`;
        await mongoose.connect(`${process.env.MONGO_URI}_${dbName}`);
        await Product.deleteMany();

    });

    beforeEach(async () => {
        await Product.create([
            { title: 'Product 1', price: 100, description: 'Description 1', category: 'something', imageUrl: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D' },
            { title: 'Product 2', price: 200, description: 'Description 2', category: 'something', imageUrl: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D' }
        ]);
    });

    afterEach(async () => {
        await Product.deleteMany();
        jest.clearAllMocks(); // Clear mocks between tests

    });

    afterAll(async () => {
        jest.restoreAllMocks(); // Ensures all mocks are restored to their original state
        await mongoose.connection.close();
    });

    test('Get all products', async () => {
        const response = await request(app).get('/api/products');

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].title).toBe('Product 1');
        expect(response.body[1].title).toBe('Product 2');
    });

    test('Get product by ID', async () => {
        const product = await Product.findOne({ title: 'Product 1' });

        const response = await request(app).get(`/api/products/${product._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe('Product 1');
    });

    test('Return 404 if product not found', async () => {
        const response = await request(app).get(`/api/products/${new mongoose.Types.ObjectId()}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Product not found');
    });
});

// tests/auth.test.js

const request = require('supertest');
const app = require('../../server'); // Path to your Express server
const mongoose = require('mongoose');
const User = require('../../models/User'); // Import the User model
const dotenv = require('dotenv');

// Load the test environment variables
dotenv.config({ path: '.env.test' });
console.log(`auth.test.js: ${process.env.MONGO_URI}`)

// jest.mock('../models/User');
describe('Authentication API Tests', () => {
    // Connect to the test database before running the tests
    beforeAll(async () => {
        const dbName = `db_auth`;
        await mongoose.connect(`${process.env.MONGO_URI}_${dbName}`);
        // await mongoose.connect(`${process.env.MONGO_URI}`);

        await User.deleteMany();
    });
    
    beforeEach(() => {
        jest.resetModules();
    });
    
    
    // Clean up the database after each test
    afterEach(async () => {
        await User.deleteMany();
        jest.clearAllMocks(); // Clear mocks between tests

    });

    // Disconnect from the database after all tests
    afterAll(async () => {
        await User.deleteMany();
        jest.restoreAllMocks(); // Ensures all mocks are restored to their original state
        await mongoose.connection.close();
    });

    test('User Registration - should create a new user and return a token', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123'
            });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.name).toBe('John Doe');
        expect(response.body.email).toBe('johndoe@example.com');

        // Check that the user was saved in the database with a hashed password
        const user = await User.findOne({ email: 'johndoe@example.com' });
        expect(user).not.toBeNull();
        expect(user.password).not.toBe('password123'); // Ensure the password is hashed
    });
    test('Prevent duplicate registration', async () => {
        const first_response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Jane Doe',
                email: 'janedoe@example.com',
                password: 'password123'
            });
        const final_response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Jane Doe',
                email: 'janedoe@example.com',
                password: 'password123'
            });
        expect(final_response.statusCode).toBe(400);
        expect(final_response.body.message).toBe('User already exists');
    });
    test('User Login - should log in an existing user and return a token', async () => {
        const user = new User({
            name: 'Jane Doe',
            email: 'wtf@example.com',
            password: 'password1234'
        });
        await user.save();

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'wtf@example.com',
                password: 'password1234'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.name).toBe('Jane Doe');
    });
    test('Invalid Login - should return an error for wrong password', async () => {
        const user = new User({
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            password: 'password123'
        });
        await user.save();

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'janedoe@example.com',
                password: 'wrongpassword'
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid email or password');
    });

    test('Invalid Login - should return an error for non-existing user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid email or password');
    });


});

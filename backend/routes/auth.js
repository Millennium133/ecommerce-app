//routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// User Registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        // Create a new user and hash the password using bcryptjs
        const user = new User({
            name,
            email,
            password  // Password will be hashed in the model's pre-save hook
        });
        await user.save();
        // Generate JWT token (assuming you have a generateAuthToken method)
        const token = user.generateAuthToken();  // JWT token generation
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            coins: user.coins,
            token  // Return the token upon registration
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during registration', error: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Check if the password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        // Send back token
        const token = user.generateAuthToken();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            coins: user.coins,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

module.exports = router;

//routes/auth.js
const express = require("express");
const axios = require("axios");

const User = require("../models/User");
const logger = require("../utils/logger");

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    logger.error(`User already exists: ${email}`);
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    // Create a new user and hash the password using bcryptjs
    const user = new User({
      name,
      email,
      password, // Password will be hashed in the model's pre-save hook
    });
    await user.save();
    // Generate JWT token (assuming you have a generateAuthToken method)
    const token = user.generateAuthToken(); // JWT token generation
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      coins: user.coins,
      role: user.role,
      token, // Return the token upon registration
    });
  } catch (error) {
    logger.error(`Error registering the user: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error during registration", error: error.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.error(`Log in Failed via invalid email: ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      logger.error(`Log in Failed via invalid password`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Send back token
    const token = user.generateAuthToken();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      coins: user.coins,
      role: user.role,
      token,
    });
  } catch (error) {
    logger.error(`Error during login: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
});

// Google Login Handler
router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Google Token
    const googleResponse = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    const { email, name, sub: googleId } = googleResponse.data;

    // Find or create user in database
    let user = await User.findOne({ googleId });
    if (!user) {
      const createdUser = new User({
        email,
        name,
        googleId,
        provider: "google",
        role: "customer",
      });
      await createdUser.save();
    }

    const token = user.generateAuthToken(); // JWT token generation

    res.json({ role: user.role, token });
  } catch (error) {
    res.status(401).json({ error: "Google login failed" });
  }
});

// Facebook Login Handler: token-based
router.post("/facebook-login", async (req, res) => {
  const { accessToken } = req.body;
  try {
    // Verify Facebook Token

    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=email,name`
    );

    const { email, name, id: facebookId } = fbResponse.data;
    // Find or create user in database
    let user = await User.findOne({ email });
    if (user) {
      // If user exists but has no Facebook ID, update the user with the Facebook ID
      if (!user.facebookId) {
        user.facebookId = facebookId;
        await user.save(); // Save the updated user
      }
    } else {
      // If the user does not exist, create a new user with Facebook login
      user = new User({
        email,
        name,
        facebookId,
        provider: "facebook",
        role: "customer", // Default role for new users
      });
      await user.save(); // Save the new user
    }
    const token = user.generateAuthToken(); // JWT token generation
    res.json({ role: user.role, token });
  } catch (error) {
    res.status(401).json({ error });
  }
});

module.exports = router;

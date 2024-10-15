// userRouter.js
const express = require("express");
const validator = require("validator");

const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

// Get the user's coin balance
router.get("/coins", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      logger.error(`User not found: ${req.user._id}`);
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ coins: user.coins });
  } catch (error) {
    logger.error(`Error fetching coin balance: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Get the profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      logger.error(`User not found: ${req.user._id}`);
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    logger.error(`Error getting the profile: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      logger.error(`User not found: ${req.user._id}`);
      return res.status(404).json({ message: "User not found" });
    }
    // Validate and sanitize the email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const validatedEmail = validator.normalizeEmail(email); // Normalize the email format

    // Validate and sanitize the name
    if (validator.isEmpty(name)) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    const validatedName = validator.escape(name); // Escape any HTML characters

    user.email = validatedEmail;
    user.name = validatedName;
    await user.save();
    res.json(user);
  } catch (error) {
    logger.error(`Error updating the profile: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

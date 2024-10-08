const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const logger = require("../utils/logger");

// Get order history for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate(
      "items.productId"
    );
    res.json(orders);
  } catch (error) {
    logger.error(`Error getting order history: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

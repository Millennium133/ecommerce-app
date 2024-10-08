const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const logger = require("../utils/logger");
const roleCheck = require("../middleware/roleMiddleware");

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

router.put(
  "/update-status/:id",
  protect,
  roleCheck("admin"),
  async (req, res) => {
    const { status } = req.body;
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        logger.error(`Order not found: ${req.params.id}`);
        return res.status(404).json({ message: "Order not found" });
      }
      order.status = status;
      await order.save();
      res.json(order);
    } catch (error) {
      logger.error(`Error updating status: ${error.message}`);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

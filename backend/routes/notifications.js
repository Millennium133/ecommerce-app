const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");
const logger = require("../utils/logger");

// Get all notifications for the user
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
      seen: false,
    });
    res.json(notifications);
  } catch (error) {
    logger.error(`Error getting all notifications from user: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark notification as seen
router.put("/mark-seen/:id", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      logger.error(`Notification not found: ${req.params.id}`);
      return res.status(404).json({ message: "Notification not found" });
    }
    notification.seen = true;
    await notification.save();
    res.json({ message: "Notification marked as seen" });
  } catch (error) {
    logger.error(`Error marking notification as seen: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const roleCheck = require("../middleware/roleMiddleware");
const { protect } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");
const { default: mongoose } = require("mongoose");
//get all users
router.get("/users", protect, roleCheck("admin"), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    logger.error(`Error getting all the users: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});
//delete the users (Admin only)
router.delete("/users/:id", protect, roleCheck("admin"), async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    logger.error(`Invalid id format: ${req.params.id}`);
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    const deletedUserId = await User.findById(req.params.id);
    if (!deletedUserId) {
      logger.error(`Users not found: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }
    await deletedUserId.deleteOne();
    res.json({ message: "User removed" });
  } catch (error) {
    logger.error(`Error deleting the users: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});
//Promote the users (Admin only)
router.put("/promote/:id", protect, roleCheck("admin"), async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    logger.error(`Invalid id format: ${req.params.id}`);
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      logger.error(`User not found: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    res.json({ message: "User promoted to admin", user });
  } catch (error) {
    logger.error(`Error promoting the users: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

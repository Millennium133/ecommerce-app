const express = require("express");
const router = express.Router();
const User = require("../models/User");
const roleCheck = require("../middleware/roleMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.get("/users", protect, roleCheck("admin"), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/promote/:id", protect, roleCheck("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save();

    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

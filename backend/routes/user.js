// userRouter.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// Get the user's coin balance
router.get("/coins", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ coins: user.coins });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching coin balance", error: error.message });
  }
});

module.exports = router;

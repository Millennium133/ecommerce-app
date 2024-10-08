const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Wishlist = require("../models/Wishlist");
const logger = require("../utils/logger");

// Get wishlist for the user
router.get("/", protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id }).populate(
      "productId"
    );
    res.json(wishlist);
  } catch (error) {
    logger.error(`Error getting wishlist for the user: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Add product to wishlist
router.post("/", protect, async (req, res) => {
  const { productId } = req.body;
  try {
    const newWishlistItem = new Wishlist({ userId: req.user._id, productId });
    await newWishlistItem.save();
    res.json(newWishlistItem);
  } catch (error) {
    logger.error(`Error adding product to wishlist: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove product from wishlist
router.delete("/:productId", protect, async (req, res) => {
  try {
    await Wishlist.deleteOne({
      userId: req.user._id,
      productId: req.params.productId,
    });
    res.json({ message: "Product removed from wishlist" });
  } catch (error) {
    logger.error(
      `Error removing product from wishlist by ID: ${error.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

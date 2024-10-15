// product.js (backend route)
const express = require("express");
const validator = require("validator");

const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");
const logger = require("../utils/logger");
const Wishlist = require("../models/Wishlist");
const Notification = require("../models/Notification");
const { sendNotification } = require("../utils/socket");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    logger.error(`Error getting all products: ${error.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.error(`Product not found: ${req.params.id}`);
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    logger.error(`Error getting product by ID: ${error.message}`);
    res.status(500).json({ message: err.message });
  }
});
//Update the product detail (Admin only)
router.put("/:id", protect, roleCheck("admin"), async (req, res) => {
  const { title, description, price, category, imageUrl } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.error(`Product not found: ${req.params.id}`);
      return res.status(404).json({ message: "Product not found" });
    }
    const oldPrice = product.price;

    // Validate and sanitize the title
    if (validator.isEmpty(title)) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }
    const validatedTitle = validator.escape(title); // Escape any HTML characters

    // Validate and sanitize the description
    if (validator.isEmpty(description)) {
      return res.status(400).json({ message: "Description cannot be empty" });
    }
    const validatedDescription = validator.escape(description); // Escape any HTML characters

    // Validate and sanitize the price
    if (validator.isEmpty(price)) {
      return res.status(400).json({ message: "Price cannot be empty" });
    }
    if (validator.isInt(price)) {
      return res.status(400).json({ message: "Price need to be Integer" });
    }
    const validatedPrice = validator.parseInt(price); // Escape any HTML characters

    // Validate and sanitize the category
    if (validator.isEmpty(category)) {
      return res.status(400).json({ message: "Category cannot be empty" });
    }
    const validatedCategory = validator.escape(category); // Escape any HTML characters

    // Validate and sanitize the ImageUrl
    if (validator.isEmpty(imageUrl)) {
      return res.status(400).json({ message: "ImageUrl cannot be empty" });
    }
    if (!validator.isURL(imageUrl)) {
      return res.status(400).json({ message: "Invalid Image URL" });
    }
    const validatedImageUrl = validator.escape(imageUrl); // Escape any HTML characters

    product.title = validatedTitle;
    product.description = validatedDescription;
    product.price = validatedPrice;
    product.category = validatedCategory;
    product.imageUrl = validatedImageUrl;
    await product.save();

    if (price < oldPrice) {
      const wishlists = await Wishlist.find({ productId: product._id });
      wishlists.forEach(async (wishlistItem) => {
        const notificationMessage = `The price of "${product.title}" has dropped to ${price} Coins.`;
        // Check if a similar notification already exists
        const existingNotification = await Notification.findOne({
          userId: wishlistItem.userId,
          message: notificationMessage,
        });

        if (!existingNotification) {
          const newNotification = new Notification({
            userId: wishlistItem.userId,
            message: notificationMessage,
          });
          await newNotification.save();
          // Send real-time notification
          sendNotification({
            userId: wishlistItem.userId,
            message: notificationMessage,
          });
        }
      });
    }

    res.json(product);
  } catch (error) {
    logger.error(`Error updating product: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});
//Add the product (Admin only)
router.post("/", protect, roleCheck("admin"), async (req, res) => {
  const { title, description, price, category, imageUrl } = req.body;
  try {
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      imageUrl,
    });
    const savedProduct = await newProduct.save();

    // Notify all users about the new product
    const users = await User.find();
    users.forEach(async (user) => {
      const notificationMessage = `A new product "${title}" has been added.`;
      const newNotification = new Notification({
        userId: user._id,
        message: notificationMessage,
      });
      await newNotification.save();

      sendNotification({
        userId: user._id,
        message: notificationMessage,
      });
    });

    res.json(savedProduct);
  } catch (error) {
    logger.error(`Error updating product: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});
//Delete the product (Admin only)
router.delete("/:id", protect, roleCheck("admin"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.error(`Product not found: ${req.params.id}`);
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    return res.json({ message: "Product removed" });
  } catch (error) {
    logger.error(`Error deleting product by ID: ${error.message}`);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

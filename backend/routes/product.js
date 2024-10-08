// product.js (backend route)
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");
const logger = require("../utils/logger");
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
    product.title = title;
    product.description = description;
    product.price = price;
    product.category = category;
    product.imageUrl = imageUrl;
    await product.save();
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

// Cart Logic
// cart.js (backend route)
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const User  = require('../models/User')
const Product = require('../models/Product')
const mongoose = require('mongoose')
const { protect } = require('../middleware/authMiddleware');


// Get all products in the cart
router.get('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
        if (!cart) {
            return res.json({ message: 'Your cart is empty', items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart', error: error.message });
    }
});

// Add or update a product in the cart
router.put('/', protect, async (req, res) => {
    const { productId, quantity } = req.body;

    // Backend validation for quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be an integer and at least 1' });
    }

    try {
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [], totalAmount: 0 });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

        if (itemIndex > -1) {
            // If product exists, update quantity and total amount
            const oldQuantity = cart.items[itemIndex].quantity;
            cart.items[itemIndex].quantity = quantity;
            cart.totalAmount += (quantity - oldQuantity) * product.price;
        } else {
            // If product doesn't exist, add to cart
            cart.items.push({ productId, quantity });
            cart.totalAmount += product.price * quantity;

        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
});

// Remove a product from the cart
router.delete('/remove/:productId', protect, async (req, res) => {
    const { productId } = req.params;
    // Check if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID format' });
    }
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }      
        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
        if (itemIndex > -1) {
            const product = await Product.findById(productId);
            cart.totalAmount -= product.price * cart.items[itemIndex].quantity;
            cart.items.splice(itemIndex, 1);
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing product from cart', error: error.message });
    }
});

// Clear the entire cart
router.delete('/clear', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
});

// Checkout
router.post('/checkout', protect, async (req, res) => {
    const { userId, totalAmount } = req.body;
    const user = await User.findById(userId);
    if (user.coins >= totalAmount) {
        user.coins -= totalAmount;
        await user.save();
        res.json({ message: 'Purchase successful', user });
    } else {
        res.status(400).json({ message: 'Insufficient balance' });
    }
});

module.exports = router;
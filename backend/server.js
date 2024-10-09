const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
const wishlistRoutes = require("./routes/wishlist");
const notificationRoutes = require("./routes/notifications");
// Conditionally load dotenv configuration
if (process.env.NODE_ENV !== "test") {
  dotenv.config();
}

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/notifications", notificationRoutes);
// app.use('/api/payment', stripeRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      app.listen(PORT, "localhost", () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => console.error("Error connecting to MongoDB 1234:", err));
}

module.exports = app;

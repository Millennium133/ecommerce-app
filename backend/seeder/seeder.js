// // seeder.js
// const mongoose = require("mongoose");
// const { faker } = require("@faker-js/faker");
// const Product = require("../models/Product"); // Assuming you have a Product model
// const dotenv = require("dotenv");

// dotenv.config();
// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });

// // Seeder function
// const seedDatabase = async () => {
//   try {
//     // Clear existing data
//     // await Category.deleteMany({});
//     await Product.deleteMany({});

//     // Predefined categories
//     const categories = [
//       { name: "Home", description: "Essentials and decor for your home." },
//       { name: "Electronics", description: "Latest gadgets and devices." },
//       { name: "Clothing", description: "Fashionable apparel for everyone." },
//       { name: "Books", description: "A wide selection of literature." },
//       { name: "Toys", description: "Fun and educational toys for children." },
//     ];

//     // Create categories
//     // const createdCategories = await Category.insertMany(categories);

//     // Generate related products
//     const products = [];
//     createdCategories.forEach((category) => {
//       for (let i = 0; i < 4; i++) {
//         // Generate 4 products for each category
//         products.push({
//           title: faker.commerce.productName(),
//           price: parseFloat(faker.commerce.price()),
//           description:
//             faker.lorem.sentence() +
//             ` Ideal for ${category.name.toLowerCase()}.`,
//           category: category._id, // Link to the category ObjectId
//           imageUrl: faker.image.imageUrl(), // Generate a random image URL
//         });
//       }
//     });

//     await Product.insertMany(products);
//     console.log("Seeding completed successfully.");
//   } catch (error) {
//     console.error("Error during seeding:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// // Run the seeder
// seedDatabase();

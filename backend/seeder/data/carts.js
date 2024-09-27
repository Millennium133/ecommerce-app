// seeder/data/carts.js

// Function to generate random carts for users
const generateCarts = (users, products, count) => {
    const carts = [];

    for (let i = 0; i < count; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const randomQuantity = Math.floor(Math.random() * 5) + 1; // Random quantity between 1 and 5
        
        carts.push({
            userId: randomUser._id,
            items: [{ productId: randomProduct._id, quantity: randomQuantity }],
            totalAmount: randomProduct.price * randomQuantity,
        });
    }

    return carts;
};
module.exports = { generateCarts };

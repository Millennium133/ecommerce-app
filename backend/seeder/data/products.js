// seeder/data/products.js

const { faker } = require('@faker-js/faker');

// Function to generate random products
const generateProducts = (count) => {
    const products = [];

    for (let i = 0; i < count; i++) {
        products.push({
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department(),
            imageUrl: faker.image.url(), // Random image URL
        });
    }

    return products;
};

module.exports = { generateProducts };

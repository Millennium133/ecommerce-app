// seeder/data/users.js

// CJS
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const generatedEmails = new Set();

const generateUsers = (count) => {
    const users = [];

    for (let i = 0; i < count; i++) {
        let email;
        do {
            email = faker.internet.email();
        } while (generatedEmails.has(email));
        
        generatedEmails.add(email);

        const hashedPassword = bcrypt.hashSync('password', 10);
        users.push({
            name: faker.internet.userName(),
            email: email,
            password: hashedPassword,
            coins: faker.number.int({ min: 500, max: 10000 }),
        });
    }

    return users;
};

module.exports = { generateUsers };

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const stylists = [
    {
        name: "Michale john",
        email: "elena@demo.com",
        password: "password123", // Real apps hash this, but this is a mock seed
        role: "stylist",
        specialties: ["Coloring", "Extensions"],
        experience: 8,
        rating: 4.9
    },
    {
        name: "Arvish",
        email: "marcus@demo.com",
        password: "password123",
        role: "stylist",
        specialties: ["Men's Cuts", "Fades"],
        experience: 12,
        rating: 5.0
    },
    {
        name: "Ruby",
        email: "Ruby@demo.com",
        password: "password123",
        role: "stylist",
        specialties: ["WomensMen's Cuts", "Fades"],
        experience: 12,
        rating: 5.0
    }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected to MongoDB for Stylists Seed");

    // Clear only stylists
    await User.deleteMany({ role: 'stylist' });
    console.log("Cleared old stylists");

    // We need to hash passwords normally, but since we are just seeding raw for fetching, 
    // we require bcrypt
    const bcrypt = require('bcryptjs');
    for (let s of stylists) {
        const salt = await bcrypt.genSalt(10);
        s.password = await bcrypt.hash(s.password, salt);
    }

    await User.insertMany(stylists);
    console.log("Successfully seeded stylists!");

    mongoose.connection.close();
}).catch(err => {
    console.error("DB Connection Error:", err);
});

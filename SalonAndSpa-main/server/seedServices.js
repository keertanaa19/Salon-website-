const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');

dotenv.config();

const services = [
    {
        name: "Men's Haircut",
        description: "Classic and modern styles tailored to your preferred look.",
        price: 35,
        duration: 45,
        category: "Haircut & Styling",
        imageUrl: "/mens-haircut.png"
    },
    {
        name: "Women's Styling",
        description: "Complete styling & coloring experience by our top professionals.",
        price: 85,
        duration: 90,
        category: "Haircut & Styling",
        imageUrl: "/womens-styling.png"
    },
    {
        name: "Spa Facial",
        description: "Rejuvenating luxury spa facial with premium organic ingredients.",
        price: 120,
        duration: 60,
        category: "Spa",
        imageUrl: "/spa-facial.png"
    },
    {
        name: "Beard Grooming",
        description: "Precision beard trim, shaping, and conditioning.",
        price: 25,
        duration: 30,
        category: "Men\'s Grooming",
        imageUrl: "/beard-trim.png"
    }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected to MongoDB");
    // Clear existing
    await Service.deleteMany({});
    console.log("Cleared old services");
    
    // Seed new
    await Service.insertMany(services);
    console.log("Successfully seeded services!");
    
    mongoose.connection.close();
}).catch(err => {
    console.error("DB Connection Error:", err);
});

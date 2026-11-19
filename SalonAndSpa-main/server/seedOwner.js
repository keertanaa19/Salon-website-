require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedOwner = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI, {
            // These options might not be required in newer Mongoose versions
            // but keeping them for safety depending on version
        });
        console.log('Connected to MongoDB for Seeding.');

        // Check if an owner already exists
        const ownerExists = await User.findOne({ role: 'owner' });
        
        if (ownerExists) {
            console.log('\nAn Owner account already exists:');
            console.log(`Email: ${ownerExists.email}`);
            console.log('Exiting...');
            process.exit(0);
        }

        // Configuration for the new owner account
        // You can change these details before running the script
        const ownerEmail = process.env.OWNER_EMAIL || 'owner@salon.com';
        const ownerPasswordRaw = process.env.OWNER_PASSWORD || 'Owner@1234';
        const ownerName = 'Salon Owner';

        // Hash the password
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ownerPasswordRaw, salt);

        // Create the owner
        const newOwner = await User.create({
            name: ownerName,
            email: ownerEmail,
            password: hashedPassword,
            role: 'owner',
            branchName: 'Headquarters',
            branchLocation: 'Main City'
        });

        console.log('\n=========================================');
        console.log('SUCCESS! Owner account created.');
        console.log('=========================================');
        console.log(`Name:     ${newOwner.name}`);
        console.log(`Email:    ${newOwner.email}`);
        console.log(`Password: ${ownerPasswordRaw}`); // Display it once so you know what it is
        console.log(`Role:     ${newOwner.role}`);
        console.log('=========================================\n');
        console.log('IMPORTANT: Please delete or secure this script after running it!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding owner account:', error);
        process.exit(1);
    }
};

seedOwner();

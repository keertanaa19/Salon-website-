const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'owner', 'stylist'],
        default: 'customer'
    },
    // Optional fields depending on the role
    branchName: {
        type: String
    },
    branchLocation: {
        type: String
    },
    specialization: { // For stylists
        type: String
    },
    bio: { // For stylists
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);

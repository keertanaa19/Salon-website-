const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Haircut & Styling', 'Hair Coloring', 'Treatments', 'Men\'s Grooming', 'Nails', 'Spa', 'Other']
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/150'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);

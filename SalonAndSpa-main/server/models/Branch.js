const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    address: { // for booking UI compatibility
        type: String,
        trim: true
    },
    managerName: {
        type: String
    },
    managerEmail: {
        type: String
    },
    rating: {
        type: Number,
        default: 5.0
    },
    status: {
        type: String,
        enum: ['Active', 'Pending', 'Closed'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Branch', branchSchema);

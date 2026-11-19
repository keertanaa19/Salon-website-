const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin/Owner
router.post('/', protect, authorize('admin', 'owner'), async (req, res) => {
    try {
        const { name, description, price, duration, category, imageUrl } = req.body;
        
        const service = await Service.create({
            name,
            description,
            price,
            duration,
            category,
            imageUrl
        });

        res.status(201).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating service' });
    }
});

module.exports = router;

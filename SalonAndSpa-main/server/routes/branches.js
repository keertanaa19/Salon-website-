const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
router.get('/', async (req, res) => {
    try {
        const branches = await Branch.find({ status: 'Active' });
        res.json(branches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Create a new branch
// @route   POST /api/branches
// @access  Protected (Owner)
router.post('/', protect, authorize('owner'), async (req, res) => {
    try {
        const { name, location, address, Manager, managerEmail } = req.body;
        
        const newBranch = new Branch({
            name,
            location,
            address: address || location,
            managerName: Manager,
            managerEmail
        });

        await newBranch.save();
        res.status(201).json(newBranch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

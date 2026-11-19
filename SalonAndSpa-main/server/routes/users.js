const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Get all stylists
// @route   GET /api/users/stylists
// @access  Public
router.get('/stylists', async (req, res) => {
    try {
        const stylists = await User.find({ role: 'stylist' }).select('-password');
        res.json(stylists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get all admins
// @route   GET /api/users/admins
// @access  Public (or protected)
router.get('/admins', async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password');
        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Delete an admin
// @route   DELETE /api/users/admins/:id
// @access  Protected
router.delete('/admins/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'admin') {
            return res.status(404).json({ message: 'Admin not found' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

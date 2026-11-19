const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/Customer
router.post('/', protect, async (req, res) => {
    try {
        const { stylistId, serviceId, date, time, totalPrice } = req.body;

        const booking = await Booking.create({
            customer: req.user._id,
            stylist: stylistId,
            service: serviceId,
            date,
            time,
            totalPrice
        });

        const createdBooking = await booking.populate(['stylist', 'service']);
        res.status(201).json(createdBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating booking' });
    }
});

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
router.get('/my-bookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user._id })
            .populate('stylist', 'name email')
            .populate('service', 'name price')
            .sort({ date: 1, time: 1 });
            
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get stylist bookings
// @route   GET /api/bookings/stylist-bookings
// @access  Private/Stylist
router.get('/stylist-bookings', protect, authorize('stylist'), async (req, res) => {
    try {
        const bookings = await Booking.find({ stylist: req.user._id })
            .populate('customer', 'name email')
            .populate('service', 'name duration')
            .sort({ date: 1, time: 1 });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get all bookings
// @route   GET /api/bookings/all
// @access  Private/Admin/Owner
router.get('/all', protect, authorize('admin', 'owner'), async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('customer', 'name email')
            .populate('stylist', 'name')
            .populate('service', 'name price')
            .sort({ date: 1, time: 1 });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Stylist/Admin/Owner
router.put('/:id/status', protect, authorize('stylist', 'admin', 'owner'), async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Optional: verify stylist owns this booking before updating
        if (req.user.role === 'stylist' && booking.stylist.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized for this booking' });
        }

        booking.status = status || booking.status;
        const updatedBooking = await booking.save();
        
        res.json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating booking' });
    }
});

module.exports = router;

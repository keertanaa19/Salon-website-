const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Invitation = require('../models/Invitation');
const User = require('../models/User');
const { sendInvitationEmail } = require('../utils/email');
const { protect, authorize } = require('../middleware/authMiddleware'); // updated to match actual file

// POST /api/invitations/send
// Owner sends an invitation to an admin
router.post('/send', protect, authorize('owner'), async (req, res) => {
    try {
        const { email, branchName, branchLocation } = req.body;

        if (!email || !branchName) {
            return res.status(400).json({ message: 'Email and Branch Name are required' });
        }

        // Check if admin already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Generate a secure crypto token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

        // Create Invitation Record
        const newInvitation = new Invitation({
            email,
            branchName,
            branchLocation,
            token,
            expiresAt
        });

        await newInvitation.save();

        // Send Email
        await sendInvitationEmail(email, token, branchName);

        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/invitations/verify/:token
// Check if the link clicked by the manager is valid
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const invitation = await Invitation.findOne({ token, status: 'Pending' });

        if (!invitation) {
            return res.status(404).json({ message: 'Invalid or already fulfilled invitation' });
        }

        // Check expiration
        if (new Date() > invitation.expiresAt) {
            return res.status(400).json({ message: 'Invitation has expired' });
        }

        res.status(200).json({ message: 'Valid token', email: invitation.email, branchName: invitation.branchName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

const bcrypt = require('bcryptjs');

// POST /api/invitations/accept
// Complete the registration of an invited admin
router.post('/accept', async (req, res) => {
    try {
        const { token, name, password } = req.body;

        if (!token || !name || !password) {
            return res.status(400).json({ message: 'Token, name, and password are required' });
        }

        const invitation = await Invitation.findOne({ token, status: 'Pending' });

        if (!invitation) {
            return res.status(404).json({ message: 'Invalid or expired invitation token' });
        }

        if (new Date() > invitation.expiresAt) {
            return res.status(400).json({ message: 'Invitation has expired' });
        }

        // Check again if user exists to prevent issues
        const existingUser = await User.findOne({ email: invitation.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create Admin User
        const adminUser = new User({
            name,
            email: invitation.email,
            password: hashedPassword,
            role: 'admin',
            branchName: invitation.branchName,
            branchLocation: invitation.branchLocation
        });

        await adminUser.save();

        // Mark invitation as Accepted
        invitation.status = 'Accepted';
        await invitation.save();

        res.status(201).json({ message: 'Admin account setup successfully. You can now log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/invitations/pending
// Get all pending invitations to display in owner dashboard
router.get('/pending', async (req, res) => {
    try {
        const invitations = await Invitation.find({ status: 'Pending' });
        res.json(invitations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE /api/invitations/:id
// Delete a pending invitation
router.delete('/:id', async (req, res) => {
    try {
        const invitation = await Invitation.findById(req.params.id);
        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }
        await Invitation.findByIdAndDelete(req.params.id);
        res.json({ message: 'Invitation deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 1. REGISTER A NEW USER (Admin can use this to add Officers)
// Endpoint: POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, password, role, state } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: "Username already taken" });

        // Create new user
        const newUser = new User({ username, password, role, state });
        await newUser.save();

        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. LOGIN (Used by Supervisor & Officers)
// Endpoint: POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Find the user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Check password (using the method we added to User.js)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 3. Create a Secure Token (JWT)
        // This token holds the user's role and state
        const token = jwt.sign(
            { id: user._id, role: user.role, state: user.state },
            process.env.JWT_SECRET || 'nddc_everlink_secret_2024',
            { expiresIn: '1d' } // Session lasts 24 hours
        );

        // 4. Send back the data
        res.status(200).json({
            success: true,
            token,
            user: {
                username: user.username,
                role: user.role,
                state: user.state
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
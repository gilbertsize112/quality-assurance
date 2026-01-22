const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 1. REGISTER A NEW USER (Staff Enrollment)
// Endpoint: POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, password, role, state } = req.body;

        // Check if user exists in the NDDC database
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: "Staff ID/Username already exists in NDDC database" 
            });
        }

        // Create new staff member
        // Note: Password hashing happens in your User Model middleware
        const newUser = new User({ 
            username, 
            password, 
            role: role || 'officer', 
            state 
        });
        
        await newUser.save();
        
        // Professional console log for Everlink Monitoring
        console.log(`✅ New Staff Enrolled: ${username} [${state}]`);

        res.status(201).json({ 
            success: true, 
            message: "Staff Account Created Successfully! Please Login." 
        });
    } catch (err) {
        console.error("Enrollment Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Security Gateway Enrollment Error",
            error: err.message 
        });
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
            return res.status(404).json({ 
                success: false, 
                message: "NDDC Security: User not found" 
            });
        }

        // 2. Check password (using the method added to User.js model)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "NDDC Security: Invalid credentials" 
            });
        }

        // 3. Create a Secure Token (JWT)
        // This token holds the user's role and state for session management
        const token = jwt.sign(
            { id: user._id, role: user.role, state: user.state },
            process.env.JWT_SECRET || 'nddc_everlink_secret_2026',
            { expiresIn: '24h' } // Session lasts 24 hours
        );

        // 4. Send back the official data
        res.status(200).json({
            success: true,
            token,
            user: {
                username: user.username,
                role: user.role,
                state: user.state
            }
        });

        console.log(`🔐 Staff Authenticated: ${username} [${user.role}]`);

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Authentication Gateway Error",
            error: err.message 
        });
    }
});

module.exports = router;
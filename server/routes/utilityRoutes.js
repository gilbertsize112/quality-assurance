const express = require('express');
const router = express.Router();
const Utility = require('../models/Utility');

// 1. SUBMIT A REPORT (Used by Utility Officers)
router.post('/submit', async (req, res) => {
    try {
        const newReport = new Utility(req.body);
        const savedReport = await newReport.save();
        res.status(201).json({
            success: true,
            message: "Infrastructure audit logged successfully",
            data: savedReport
        });
    } catch (err) {
        console.error("Submission Error:", err);
        res.status(400).json({ 
            success: false, 
            message: "Failed to log audit report", 
            error: err.message 
        });
    }
});

// 2. GET ALL REPORTS (Used by General Supervisor Dashboard)
router.get('/all', async (req, res) => {
    try {
        const reports = await Utility.find().sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve system reports", 
            error: err.message 
        });
    }
});

// 3. GET CRITICAL ALERTS (Condition Level 1)
router.get('/critical', async (req, res) => {
    try {
        const criticalReports = await Utility.find({ conditionKey: 1 }).sort({ createdAt: -1 });
        res.status(200).json(criticalReports);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. ADVANCED FILTERING (Search by State, Inspector, or Utility Name)
// Endpoint: GET /api/utilities/filter?state=ABIA&inspectorName=John
router.get('/filter', async (req, res) => {
    try {
        const { state, inspectorName, utilityName } = req.query;
        let query = {};

        if (state) query.state = state;
        if (inspectorName) query.inspectorName = { $regex: inspectorName, $options: 'i' }; // Case-insensitive search
        if (utilityName) query.utilityName = { $regex: utilityName, $options: 'i' };

        const filteredResults = await Utility.find(query).sort({ createdAt: -1 });
        res.status(200).json(filteredResults);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
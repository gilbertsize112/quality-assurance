const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// --- IMPORT ROUTES ---
const utilityRoutes = require('./routes/utilityRoutes');
const authRoutes = require('./routes/authRoutes'); 

// Load environment variables
dotenv.config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- KEEP-ALIVE ROUTE (For UptimeRobot) ---
app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

// --- ROUTES ---
app.use('/api/auth', authRoutes);           // Authentication (Login/Register)
app.use('/api/utilities', utilityRoutes);   // Utility Audit Operations

// Root Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        status: "Online",
        message: "NDDC Quality Assurance API is Running...",
        systems: ["Authentication", "Audit Logs", "State Monitoring"],
        monitored_states: ["ABIA", "CROSS RIVERS", "AKWA IBOM", "IMO STATE"]
    });
});

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nddc_qa';

mongoose.set('strictQuery', false); 
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("------------------------------------------");
        console.log("NDDC Database Connected Successfully ✅");
        console.log("------------------------------------------");
    })
    .catch(err => console.log("Database Connection Error ❌: ", err));

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error("Critical Error:", err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : "Contact Admin"
    });
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server active on port ${PORT}`);
    console.log(`📡 Everlink Telesat Monitoring Live: Abia, Cross Rivers, Akwa Ibom, Imo`);
    console.log(`🔐 Auth System: Active`);
    console.log(`💓 Keep-alive endpoint: /ping`);
});
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User'); // Ensure this path is correct

dotenv.config();

const users = [
    // Supervisors (Admins)
    { username: 'Dr Uteme', password: 'ops77', role: 'admin', state: 'HQ' },
    { username: 'Egondu Ogbalor', password: 'qa88', role: 'admin', state: 'HQ' },
    { username: 'pere', password: 'dir99', role: 'admin', state: 'HQ' },

    // Officers (State Specific)
    { username: 'Favour', password: 'abia2026', role: 'officer', state: 'ABIA' },
    { username: 'Tender', password: 'cross2026', role: 'officer', state: 'CROSS RIVERS' },
    { username: 'Dike', password: 'imo2026', role: 'officer', state: 'IMO STATE' },
    { username: 'Etima', password: 'akwa2026', role: 'officer', state: 'AKWA IBOM' }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nddc_qa');
        
        // Clear existing users to avoid duplicates during testing
        await User.deleteMany({});
        console.log("Existing users cleared...");

        // Insert the new users
        // Note: The hashing happens automatically because of the .pre('save') hook in your User.js
        for (let u of users) {
            const newUser = new User(u);
            await newUser.save();
            console.log(`✅ Registered: ${u.username} (${u.role})`);
        }

        console.log("------------------------------------------");
        console.log("NDDC Staff Database Seeded Successfully! 🎉");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};

seedDB();
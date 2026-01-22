const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { 
        type: String, 
        // Fully updated roles to include supervisor and staff
        enum: ['officer', 'admin', 'supervisor', 'staff'], 
        default: 'officer' 
    },
    state: { 
        type: String, 
        required: true,
        uppercase: true, 
        enum: [
            'ABIA', 
            'AKWA IBOM', 
            'BAYELSA', 
            'CROSS RIVER', 
            'DELTA', 
            'EDO', 
            'IMO', 
            'RIVERS', 
            'ONDO', 
            'HEAD QUATERS',     // Matches your current frontend string
            'HEADQUARTERS',      // Backup common spelling
            'HEAD QUARTERS'      // Added for extra safety
        ] 
    }
}, { timestamps: true });

// PASSWORD HASHING: Modern Async Syntax (Removed 'next' to fix the TypeError)
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // With async/await, Mongoose moves to the next step when the function finishes
    } catch (err) {
        throw err;
    }
});

// HELPER METHOD: To check if password matches
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
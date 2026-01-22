const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { type: String, enum: ['officer', 'admin'], default: 'officer' },
    // I updated the enum to match all NDDC states and the names used in your frontend
    state: { 
        type: String, 
        required: true,
        uppercase: true, // This automatically converts 'Abia' to 'ABIA' before saving
        enum: [
            'ABIA', 'AKWA IBOM', 'BAYELSA', 'CROSS RIVER', 
            'DELTA', 'EDO', 'IMO', 'RIVERS', 'ONDO', 'HQ'
        ] 
    }
}, { timestamps: true });

// PASSWORD HASHING: Modern Async Syntax
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw new Error(err);
    }
});

// HELPER METHOD: To check if password matches
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
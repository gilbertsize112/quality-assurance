const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { type: String, enum: ['officer', 'admin'], default: 'officer' },
    state: { type: String, enum: ['ABIA', 'CROSS RIVERS', 'AKWA IBOM', 'IMO STATE', 'HQ'], required: true }
}, { timestamps: true });

// PASSWORD HASHING: Modern Async Syntax
// We remove 'next' to prevent the TypeError in modern Mongoose
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw new Error(err);
    }
});

// HELPER METHOD: To check if the password entered matches the scrambled one in the DB
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
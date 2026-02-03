const mongoose = require('mongoose');

// The blueprint for every quiz result saved in 2026
const resultSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    score: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: 'Quantum AI'
    },
    date: {
        type: Date,
        default: Date.now // Automatically logs when the user finished
    }
});

module.exports = mongoose.model('Result', resultSchema);

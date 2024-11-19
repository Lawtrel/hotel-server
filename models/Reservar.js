const mongoose = require('mongoose');

const ReservarSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true},
    checkInDate: {type: Date, required: true},
    checkOutDate: {type: Date, required: true},
    guests: {type: Number, required: true},
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservar',ReservarSchema);
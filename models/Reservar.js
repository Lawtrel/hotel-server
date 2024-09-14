const mongoose = require('mongoose');

const ReservarSchema = new mongoose.Schema({
    name: { type: String, required: true},
    nSala: {type: Number, required: true},
    checkInData: {type: Date, required: true},
    checkOutData: {type: Date, required: true},
    status: {type: String, default: 'pendente'},
});

module.exports = mongoose.model('Reservar',ReservarSchema);
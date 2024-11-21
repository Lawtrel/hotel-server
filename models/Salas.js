const mongoose = require('mongoose');

const SalaSchema = new mongoose.Schema({
    nSala: { type: Number, required: true },
    tipoSala: { type: String, required: true },
    disponivel: { type: Boolean, default: true },
});

module.exports = mongoose.model('Salas', SalaSchema);

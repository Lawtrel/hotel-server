const express = require('express');
const rotas = express.Router();
const Salas = require('../models/Salas');

// Criar uma nova sala
rotas.post('/salas', async (req, res) => {
    const { nSala, tipoSala } = req.body;
    try {
        const novaSala = new Salas({ nSala, tipoSala });
        await novaSala.save();
        res.status(201).json(novaSala);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar a sala', details: error.message });
    }
});

// Listar todas as salas
rotas.get('/salas', async (req, res) => {
    try {
        const salas = await Salas.find();
        res.json(salas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar as salas', details: error.message });
    }
});

// Atualizar disponibilidade de uma sala
rotas.put('/salas/:id', async (req, res) => {
    const { disponivel } = req.body;
    try {
        const sala = await Salas.findById(req.params.id);
        if (sala) {
            sala.disponivel = disponivel;
            await sala.save();
            res.json(sala);
        } else {
            res.status(404).json({ error: 'Sala não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar a sala', details: error.message });
    }
});

module.exports = rotas;

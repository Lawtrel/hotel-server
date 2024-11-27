const express = require('express');
const rotas = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Reservar = require('../models/Reservar');
const Salas = require('../models/Salas');

//Rota para reservar
rotas.post('/reservar', authMiddleware, async (req, res) => {

    try {
        console.log('Dados do req.user na rota:', req.user);
        console.log("User logado: ",req.user);
        
        const { name, checkInDate, checkOutDate, guests, roomId } = req.body;
        const { id } = req.user;

        // Cria a reserva
        const reserva = new Reservar({
            userId: id,
            name,
            checkInDate,
            checkOutDate,
            guests,
            roomId,
        });
        await reserva.save();

        // Atualizar a disponibilidade da sala
        await Salas.findByIdAndUpdate(reserva.roomId, { disponivel: false});

        res.status(201).json(reserva);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar a reserva', details: error.message });
    }
});

// Rota para desfazer a reserva
rotas.post('/desfazer-reserva/:id', authMiddleware, async (req, res) => {
    try {
        const reservaId = req.params.id;
        const reserva = await Reservar.findById(reservaId);

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva não encontrada' });
        }

        // Atualizar a disponibilidade da sala
        await Salas.findByIdAndUpdate(reserva.roomId, { disponivel: true });

        // Remover a reserva
        await Reservar.findByIdAndDelete(reservaId);

        res.status(200).json({ message: 'Reserva desfeita com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao desfazer a reserva', details: error.message });
    }
});

//Listar todas as reservas
rotas.get('/reservas', authMiddleware, async (req, res) => {
    const userId = req.user._id; // Certifique-se de que `req.user` contém o ID do usuário autenticado
    try {
        const reservas = await Reservar.find({userId})
            .populate('roomId');
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar as reservas'});
    }
});
  
  module.exports = rotas;
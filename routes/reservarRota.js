const express = require('express');
const rotas = express.Router();
auth = require('../middleware/authMiddleware');
const Reservar = require('../models/Reservar');
const authMiddleware = require('../middleware/authMiddleware');

//Api criar nova reserva
rotas.post('/reservar',authMiddleware, async( req, res) => {
    const { name, checkInDate, checkOutDate, guests } = req.body;

    // Validações no servidor
    if (!name || !checkInDate || !checkOutDate || !guests) {
        return res.status(400).json({ message: 'Preencha todos os campos corretamente.' });
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
        return res.status(400).json({ message: 'A data de check-out deve ser posterior à data de check-in.' });
    }

    try {
        // Criação da reserva no banco de dados
        const newReservation = new Reservar({
            userId: req.user.id, // Associar a reserva ao usuário autenticado
            name,
            checkInDate,
            checkOutDate,
            guests,
        });

        await newReservation.save();

        return res.status(201).json({ message: 'Reserva criada com sucesso!', reservation: newReservation });
    } catch (error) {
        console.error('Erro ao criar reserva:', error);
        return res.status(500).json({ message: 'Erro ao processar a reserva. Tente novamente mais tarde.' });
    }
});

//Listar todas as reservas
rotas.get('/reservas', async (req, res) => {
    try {
        const reservas = await Reservar.find();
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar as reservas'});
    }
});
// fazer checkin
rotas.put('/checkin/:id', async (req, res) => {
    try {
        const reserva = await Reservar.findById(req.params.id);
        if (reserva) {
            reserva.status = 'checked-in';
            await reserva.save();
            res.json(reserva);
        } else {
            res.status(404).json({ error: 'Reserva não encontrada'});
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer check-in'});
    }
});
// Fazer check-out
rotas.put('/checkout/:id', async (req, res) => {
    try {
      const reserva = await Reservar.findById(req.params.id);
      if (reserva) {
        reserva.status = 'checked-out';
        await reserva.save();
        res.json(reserva);
      } else {
        res.status(404).json({ error: 'Reserva não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer check-out' });
    }
  });
  
  module.exports = rotas;
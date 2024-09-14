const express = require('express');
const rotas = express.Router();
const Reservar = require('../models/Reservar');

//Api criar nova reserva
rotas.post('/reservar', async( req, res) => {
    const {name, nSala, checkInData, checkOutData} = req.body;
    try {
        const novaReserva = new Reservar({ name, nSala, checkInData, checkOutData});
        await novaReserva.save();
        res.json(novaReserva);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer a reserva', details: error.message});
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
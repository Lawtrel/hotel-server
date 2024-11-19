const express = require('express');
const rotas = express.Router();
const Salas = require('../models/Salas');
const Reserva = require('../models/Reservar');
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

// Lista as salas disponíveis para datas específicas
rotas.get('/salas-disponivel', async (req, res) => {
    //const { checkInDate, checkOutDate } = req.query;

  //  if (!checkInDate || !checkOutDate) {
  //      return res.status(400).json({ error: 'As datas de check-in e check-out são obrigatórias.' });
   // }

    try {
       /* const checkIn = new Date(checkInDate);
        //const checkOut = new Date(checkOutDate);

        //if (isNaN(checkIn) || isNaN(checkOut)) {
        //    return res.status(400).json({ error: 'Formato de data inválido.' });
       // }

        const salasDisponivel = await Salas.find({
            $or: [
                { checkOutDate: { $lt: checkIn } }, // Check-out antes do check-in desejado
                { checkInDate: { $gt: checkOut } }  // Check-in após o check-out desejado
            ]
        });*/
        const salasDisponivel = await Salas.find({ disponivel: true });
        res.json(salasDisponivel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar quartos disponíveis', details: error.message });
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

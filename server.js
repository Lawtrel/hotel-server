require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const reservarRota = require('./routes/reservarRota');
const salaRota = require('./routes/salaRota');
const authRota = require('./routes/authRota');

// Conectar ao MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRota);
// Rotas protegidas
app.use('/api', reservarRota);
app.use('/api', salaRota);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
require('dotenv').config();

const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

router.get('/current-user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario Não encontrado'});
        }
        res.json({ user, expiresIn: req.user.exp });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter usuário', error });
    }
});
// Rota de Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Tentativa de login:", { email });

    try {
        // Verifica se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            console.error("Usuário não encontrado.");
            return res.status(400).json({ message: 'E-mail inválido.' });
        }

        console.log("Usuário encontrado:", user.email);

        // Verifica se a senha está correta
        const hashedPassword  = hashPassword(password);
        if (hashedPassword  !== user.password) {
            console.error("Senha inválida.");
            return res.status(400).json({ message: 'Senha inválida.' });
        }

        console.log("Senha válida. Gerando token...");

        // Gera um token JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ message: 'Login bem-sucedido.', token });
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.', error });
    }
});

// Rota de Registro
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Tentativa de registro:", { name, email });

    try {
        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("E-mail já registrado.");
            return res.status(400).json({ message: 'E-mail já registrado.' });
        }

        // Cria um novo hash para a senha
        const hashedPassword = hashPassword(password);

        // Cria um novo usuário
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        console.log("Usuário registrado com sucesso:", email);
        return res.status(201).json({ message: 'Conta criada com sucesso!' });
    } catch (error) {
        console.error("Erro no registro:", error);
        return res.status(500).json({ message: 'Erro ao criar conta. Tente novamente mais tarde.', error });
    }
});

module.exports = router;

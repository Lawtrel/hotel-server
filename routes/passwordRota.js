require('dotenv').config();

const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const {authToken} = require('../middleware/authMiddleware');

// Rota para solicitar a redefinição de senha
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).send('User não encontrado.');
    }

    // Geração do token de redefinição de senha
    const retoken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = retoken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Configuração do transporte de e-mail
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Redefinição de senha',
        text: `Você está recebendo este e-mail porque você (ou alguém) solicitou a redefinição da senha da sua conta.\n\n` +
              `Por favor, clique no seguinte link ou cole-o no seu navegador para completar o processo:\n\n` +
              `http://localhost:3000/reset-password/${token}\n\n` +
              `Se você não solicitou isso, por favor, ignore este e-mail e sua senha permanecerá inalterada.\n`
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return res.status(500).send('Erro ao enviar e-mail.rota');
        }
        res.status(200).send('E-mail de redefinição de senha enviado com sucesso.');
    });
});

// Rota para redefinir a senha
router.post('/reset-password', authToken, async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send('Token inválido ou expirado.');
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).send('Senha redefinida com sucesso.');
});

module.exports = router;

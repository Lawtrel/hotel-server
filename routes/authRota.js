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

// Rota para solicitar a redefinição de senha
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log({email})

    try{
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User não encontrado.');
        }
    
        // Geração do token de redefinição de senha
        const token = crypto.randomBytes(20).toString('hex');
        user.resetpasswordToken = token;
        user.resetpasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();
    
        console.log(token,Date.now)
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

    }catch(error){
        console.error("Erro no envio:", error);
        return res.status(500).json({ message: 'Erro ao criar requisição de troca de senha.', error });
    }
    
});

// Rota para redefinir a senha
router.post('/reset-password/:id', async (req, res) => {
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
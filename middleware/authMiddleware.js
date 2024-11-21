const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token'); // Token enviado no cabeçalho da requisição
    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Substitua pelo seu segredo
        console.log('Token recebido:', token);
        console.log('Usuário decodificado:', decoded);
        req.user = decoded; // Decodifique o token e atribua o usuário ao req.user
        next();
        console.log('Token recebido no cabeçalho:', req.header('x-auth-token'));
    console.log('Usuário decodificado no middleware:', req.user);
    } catch (error) {
        res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = authMiddleware;

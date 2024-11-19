const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secrettoken';
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Acesso negado.'});

    try {
        const decoded =  jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({message: 'Token inválido'});
    }
};
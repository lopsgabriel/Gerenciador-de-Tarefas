const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function verificarToken(req, res, next) {
  const raw = req.headers['authorization'] || '';
  const m = raw.match(/^Bearer\s+([^,\s]+)/i); 
  const token = m?.[1];

  if (!token) return res.status(401).json({ erro: 'Token ausente ou malformado.' });

  try {
    jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ erro: 'Token expirado ou inválido.' });
  }
}

module.exports = verificarToken
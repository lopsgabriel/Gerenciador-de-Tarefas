const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

/**
 * Middleware para verificar o token JWT presente no header Authorization.
 * - Espera o formato: "Authorization: Bearer <token>".
 * - Caso não haja token ou esteja malformado → 401.
 * - Caso o token seja inválido ou expirado → 401.
 * - Se o token for válido → chama next() e segue para a rota.
 */

function verificarToken(req, res, next) {

  // Extrai o header "Authorization" ou usa string vazia
  const raw = req.headers['authorization'] || '';

  // Expressão para pegar "Bearer <token>"
  const m = raw.match(/^Bearer\s+([^,\s]+)/i); 
  const token = m?.[1];

  // Caso não exista token válido
  if (!token) return res.status(401).json({ erro: 'Token ausente ou malformado.' });

  try {
    // Verifica a assinatura e validade do token
    jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    // Se falhar (token inválido ou expirado)
    return res.status(401).json({ erro: 'Token expirado ou inválido.' });
  }
}

// Exporta o middleware para uso nas rotas
module.exports = verificarToken
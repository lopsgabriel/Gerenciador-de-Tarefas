require('dotenv').config();
// Configurações
const PORTA = process.env.PORT || 7000;
const ORIGEM = process.env.ORIGEM || 'http://localhost:5173';
const APP_PASSWORD = process.env.APP_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  PORTA,
  ORIGEM,
  APP_PASSWORD,
  JWT_SECRET
}
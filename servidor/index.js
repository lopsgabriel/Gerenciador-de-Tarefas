require('dotenv').config();
const { PORTA } = require('./src/config');
const app =require('./src/server');

if (require.main === module) {
  app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));
}
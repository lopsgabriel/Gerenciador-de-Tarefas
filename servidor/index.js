// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa a porta configurada e o app principal
const { PORTA } = require('./src/config');
const app =require('./src/server');


// ---------------------------------------------------
// - Só inicia o servidor caso este arquivo seja
//   executado diretamente (node server.js).
// - Isso permite reutilizar `app` em outros contextos
//   (ex.: testes com supertest), sem abrir múltiplos servers.
// ---------------------------------------------------
if (require.main === module) {
  app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));
}
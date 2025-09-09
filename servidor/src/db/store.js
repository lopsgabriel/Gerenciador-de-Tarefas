const fs = require('fs');
const path = require('path');

// Caminho do arquivo JSON usado como "banco de dados".
// Caso exista a variável de ambiente DATA_PATH, ela será usada.
// Senão, o sistema cria/usa o arquivo 'dados.json' na raiz do projeto.
const DATA_PATH =
  process.env.DATA_PATH ||
  path.join(__dirname, '..', '..', 'dados.json');

/**
 * Carrega os dados do arquivo JSON.
 * - Tenta ler o arquivo e converter para objeto JS.
 * - Caso o arquivo não exista ou dê erro na leitura,
 *   retorna um objeto inicial com uma lista vazia de tarefas.
 */
function carregarDados(){
  try{
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data); // converte JSON para objeto
  }catch(e){
    // Se não existir ou der erro, retorna estrutura inicial
    return { tarefas: [] };
  }
}

/**
 * Salva os dados no arquivo JSON.
 * - Recebe um objeto JS (ex.: { tarefas: [...] }).
 * - Converte para string JSON formatada.
 * - Sobrescreve o arquivo de dados.
 */
function salvarDados(dados){
  fs.writeFileSync(DATA_PATH, JSON.stringify(dados, null, 2));
}

// Exporta as funções e o caminho do arquivo para uso em outros módulos.
module.exports = {
  carregarDados,
  salvarDados, 
  DATA_PATH
}
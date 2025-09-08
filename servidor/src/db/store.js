const fs = require('fs');
const path = require('path');
// Banco de dados em JSON
const DATA_PATH = path.join(__dirname, '../../dados.json');

function carregarDados(){
  try{
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  }catch(e){
    return { tarefas: [] };
  }
}

function salvarDados(dados){
  fs.writeFileSync(DATA_PATH, JSON.stringify(dados, null, 2));
}

module.exports = {
  carregarDados,
  salvarDados
}
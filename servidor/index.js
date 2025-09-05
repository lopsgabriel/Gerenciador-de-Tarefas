require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();

// Configurações
const PORTA = process.env.PORT || 7000;
const ORIGEM = process.env.ORIGEM || 'http://localhost:5173';
const APP_PASSWORD = process.env.APP_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors({ origin: ORIGEM, credentials: false }));
app.use(express.json());

// Banco de dados em JSON
const DATA_PATH = path.join(__dirname, 'dados.json');

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

// Autenticação
app.post('/login', (req, res) => {
  const {senha} = req.body || {};
  if (!senha) return res.status(401).json('Informe a senha');
  if (senha !== APP_PASSWORD) return res.status(401).json('Senha inválida');

  const token = jwt.sign({ acesso: 'permitido'}, JWT_SECRET, { expiresIn: '12h'});
  res.json(token);
})

function verificarToken(req, res, next) {
  const raw = req.headers['authorization'] || '';
  const m = raw.match(/^Bearer\s+([^,\s]+)/i); // pega só o primeiro token limpo
  const token = m?.[1];

  if (!token) return res.status(401).json({ erro: 'Token ausente ou malformado.' });

  try {
    jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ erro: 'Token expirado ou inválido.' });
  }
}

// Rotas
app.get('/tarefas', verificarToken, (req, res) => {
  const dados = carregarDados();
  res.json(dados.tarefas);
});

app.get('/tarefas/:id', verificarToken, (req, res) => {
  const {id} = req.params;
  const dados = carregarDados();
  const tarefa = dados.tarefas.find(t => t.id === id);
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa nao encontrada.' });
  res.json(tarefa);
});

app.post('/login', (req, res) => {
  const { senha } = req.body || {};
  if (!senha) return res.status(400).json({ erro: 'Informe a senha.' });
  if (senha !== APP_PASSWORD) return res.status(401).json({ erro: 'Senha incorreta.' });

  const token = jwt.sign({ acesso: 'permitido' }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token });
});

app.post('/tarefas', verificarToken, (req, res) => {
  const { nome, descricao } = req.body || {};
  if (!nome || !nome.trim()) return res.status(400).json({ erro: 'Nome é obrigatório.' });

  const dados = carregarDados();
  const tarefa = {
    id: Date.now().toString(),
    nome: nome.trim(),
    descricao: (descricao || '').trim()
  };
  dados.tarefas.push(tarefa);
  salvarDados(dados);
  res.status(201).json(tarefa);
});

app.put('/tarefas/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body || {};

  const dados = carregarDados();
  const idx = dados.tarefas.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ erro: 'Tarefa não encontrada.' });

  if (nome !== undefined) dados.tarefas[idx].nome = String(nome).trim();
  if (descrição !== undefined) dados.tarefas[idx].descricao = String(descricao || '').trim();

  salvarDados(dados);
  return res.json(dados.tarefas[idx]);
})

app.delete('/tarefas/:id', verificarToken,(req, res) => {
  const {id} = req.params;
  const dados = carregarDados();
  const antes = dados.tarefas.length;
  dados.tarefas = dados.tarefas.filter(t => t.id !== id);
  if (dados.tarefas.length === antes) return res.status(404).json({erro: 'Tarefa não encontrada'});
  salvarDados(dados);
  res.status(204).end();
})

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
})

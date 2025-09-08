require('dotenv').config();
const { JWT_SECRET, APP_PASSWORD, ORIGEM, PORTA } = require('./config');
const verificarToken = require('./authentication/auth');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { carregarDados, salvarDados } = require('./db/store');

const app = express();

// Middleware
app.use(cors({ origin: ORIGEM, credentials: false }));
app.use(express.json());

// Autenticação
app.post('/login', (req, res) => {
  const {senha} = req.body || {};
  if (!senha) return res.status(401).json('Informe a senha');
  if (senha !== APP_PASSWORD) return res.status(401).json('Senha inválida');

  const token = jwt.sign({ acesso: 'permitido'}, JWT_SECRET, { expiresIn: '12h'});
  res.json(token);
})

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
  if (descricao !== undefined) dados.tarefas[idx].descricao = String(descricao || '').trim();

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

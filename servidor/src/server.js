// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

// Configurações principais (senha de acesso, porta, secret JWT, origem do front-end)
const { JWT_SECRET, APP_PASSWORD, ORIGEM, PORTA } = require('./config');

// Middleware de autenticação (verifica se o token JWT é válido)
const verificarToken = require('./authentication/auth');

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Funções utilitárias para ler/escrever no "banco de dados" (JSON local)
const { carregarDados, salvarDados } = require('./db/store');

const app = express();

// ------------------------------------------------------
//  Middlewares globais
// ------------------------------------------------------

// Libera acesso ao front-end configurado na variável ORIGEM
// (CORS garante que apenas o domínio autorizado use a API)
app.use(cors({ origin: ORIGEM, credentials: false }));

// Permite receber e interpretar JSON no corpo das requisições
app.use(express.json());

// ------------------------------------------------------
//  Rota de Login (gera JWT)
// ------------------------------------------------------
app.post('/login', (req, res) => {
  const {senha} = req.body || {};

  // Validações básicas
  if (!senha) return res.status(400).json({erro:'Informe a senha.'});
  if (senha !== APP_PASSWORD) return res.status(401).json({erro:'Senha inválida.'});

   // Gera um token JWT válido por 12 horas
  const token = jwt.sign({ acesso: 'permitido'}, JWT_SECRET, { expiresIn: '12h'});
  res.json({token:token});
})

// ------------------------------------------------------
//  CRUD de Tarefas (todas as rotas protegidas por JWT)
// ------------------------------------------------------

// Listar todas as tarefas
app.get('/tarefas', verificarToken, (req, res) => {
  const dados = carregarDados();
  res.json(dados.tarefas);
});

// Obter uma tarefa específica pelo ID
app.get('/tarefas/:id', verificarToken, (req, res) => {
  const {id} = req.params;
  const dados = carregarDados();
  const tarefa = dados.tarefas.find(t => t.id === id);
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
  res.json(tarefa);
});

// Criar uma nova tarefa
app.post('/tarefas', verificarToken, (req, res) => {
  const { nome, descricao } = req.body || {};

  // Validações de entrada
  if (!nome || !nome.trim()) return res.status(400).json({ erro: 'Nome é obrigatório.' });
  if (nome.length > 50) return res.status(400).json({ erro: 'Nome com muitos caracteres.' });

  // Cria objeto da nova tarefa
  const dados = carregarDados();
  const tarefa = {
    id: Date.now().toString(),
    nome: String(nome).trim().slice(0, 50),
    descricao: (descricao || '').trim()
  };
  dados.tarefas.push(tarefa);
  salvarDados(dados);
  res.status(201).json(tarefa);
});

// Atualizar uma tarefa existente
app.put('/tarefas/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body || {};

  const dados = carregarDados();
  const idx = dados.tarefas.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
  if (nome.length > 50) return res.status(400).json({ erro: 'Nome com muitos caracteres.' });

  // Atualiza apenas os campos enviados
  if (nome !== undefined) dados.tarefas[idx].nome = String(nome).trim().slice(0, 50);
  if (descricao !== undefined) dados.tarefas[idx].descricao = String(descricao || '').trim();

  salvarDados(dados);
  return res.json(dados.tarefas[idx]);
})

// Excluir uma tarefa existente
app.delete('/tarefas/:id', verificarToken,(req, res) => {
  const {id} = req.params;
  const dados = carregarDados();
  const antes = dados.tarefas.length;
  dados.tarefas = dados.tarefas.filter(t => t.id !== id);

  // Se não removeu nada, significa que o ID não existia
  if (dados.tarefas.length === antes) return res.status(404).json({erro: 'Tarefa não encontrada.'});
  salvarDados(dados);
  res.status(204).end(); // 204 = success sem conteúdo
})

// Exporta a aplicação (usada no server.js ou nos testes)
module.exports = app

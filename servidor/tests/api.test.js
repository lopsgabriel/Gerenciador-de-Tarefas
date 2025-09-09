const path = require('path');
const fs = require('fs');
const request = require('supertest');
const os = require('os');


// ---------------------------------------------------------
//  Configuração de ambiente p/ os testes
// - Usamos senha e segredo fixos (apenas no ambiente de teste).
// - DATA_PATH aponta para um arquivo temporário no sistema,
//   garantindo que o "banco" (JSON) seja isolado e descartável.
// ---------------------------------------------------------
process.env.APP_PASSWORD = '123';
process.env.JWT_SECRET = 'segredo';

// Caminho do dados.json no diretório temporário do SO 
process.env.DATA_PATH = path.join(os.tmpdir(), `dados-test-${Date.now()}.json`);

// Importa o app só depois de setar as envs acima
const app = require('../src/server');

// ---------------------------------------------------------
//  Reseta o "banco" antes de cada teste
// - Escreve um estado inicial previsível no arquivo DATA_PATH.
// - Isso evita interferência entre testes e garante repetibilidade.
// ---------------------------------------------------------
function resetDB() {
  const inicio = {
    tarefas: [
      { id: '1', nome: 'Comprar pão', descricao: 'Padaria' },
      { id: '2', nome: 'Estudar React', descricao: 'Hooks e state' },
    ],
  };
  fs.writeFileSync(process.env.DATA_PATH, JSON.stringify(inicio, null, 2));
}

// Reseta antes de cada teste
beforeEach(resetDB);

// opcional: apaga o arquivo depois de todos os testes
afterAll(() => {
  try { fs.unlinkSync(process.env.DATA_PATH); } catch {}
});

describe('API de Tarefas', () => {
  // Garantia extra: reseta antes de cada caso (idempotente)
  beforeEach(() => resetDB());

  // -------------------------------------------------------
  //  Helpers p/ autenticação nos testes
  // - loginOk(): obtém um token válido (senha correta).
  // - auth(token): gera o header Authorization: Bearer <token>.
  // -------------------------------------------------------
  async function loginOk() {
    const r = await request(app).post('/login').send({ senha: '123' });
    return r.body.token;
  }
  function auth(token) {
    return { Authorization: `Bearer ${token}` };
  }

  // ----------------------
  //  Testes de /login
  // ----------------------
  test('recusa login sem senha (400)', async () => {
    const r = await request(app).post('/login').send({});
    expect(r.status).toBe(400);
    expect(r.body.erro).toBe('Informe a senha.');
  });

  test('recusa login com senha incorreta (401)', async () => {
    const r = await request(app).post('/login').send({ senha: 'errada' });
    expect(r.status).toBe(401);
    expect(r.body.erro).toBe('Senha inválida.');
  });

  test('loga com senha correta e retorna token (200)', async () => {
    const r = await request(app).post('/login').send({ senha: '123' });
    expect(r.status).toBe(200);
    expect(r.body.token).toBeTruthy();
  });

  // ----------------------
  //  Proteção por JWT
  // ----------------------
  test('protege /tarefas sem token (401)', async () => {
    const r = await request(app).get('/tarefas');
    expect(r.status).toBe(401);
  });

  // ----------------------
  //  GET /tarefas
  // ----------------------
  test('lista tarefas com token (200)', async () => {
    const login = await request(app).post('/login').send({ senha: '123' });
    const token = login.body.token;

    const r = await request(app)
      .get('/tarefas')
      .set('Authorization', `Bearer ${token}`);

    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
    expect(r.body).toHaveLength(2);
  });

  // ----------------------
  // GET /tarefas/:id
  // ----------------------
  test('busca uma tarefa (200)', async () => {
    const login = await request(app).post('/login').send({ senha: '123' });
    const token = login.body.token;
    const r = await request(app)
      .get('/tarefas/1')
      .set('Authorization', `Bearer ${token}`);

    expect(r.status).toBe(200);
    expect(r.body.id).toBe('1');
    expect(r.body.nome).toBe('Comprar pão');
  });

  test('busca uma tarefa inexistente (404)', async () => {
    const login = await request(app).post('/login').send({ senha: '123' });
    const token = login.body.token;
    const r = await request(app)
      .get('/tarefas/3')
      .set('Authorization', `Bearer ${token}`);

    expect(r.status).toBe(404);
    expect(r.body.erro).toBe('Tarefa não encontrada.');
  });

  // ----------------------
  //  POST /tarefas
  // ----------------------
  test('cria tarefa (201) e retorna objeto criado', async () => {
    const login = await request(app).post('/login').send({ senha: '123' });
    const token = login.body.token;
    const r = await request(app)
      .post('/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Teste', descricao: 'Teste' });

    expect(r.status).toBe(201);
    expect(r.body.id).toBeTruthy();
    expect(r.body.nome).toBe('Teste');
  });

  test('cria tarefa com nome muito longo (400)', async () => {
    const login = await request(app).post('/login').send({ senha: '123' });
    const token = login.body.token;
    const nome = "A".repeat(51);
    const r = await request(app)
      .post('/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: nome, descricao: 'Teste' });

    expect(r.status).toBe(400);
    expect(r.body.erro).toBe('Nome com muitos caracteres.');
  });

  test('tenta criar tarefa com nome vazio (400)', async () => {
    const token = await loginOk();
    const r = await request(app)
      .post('/tarefas')
      .set(auth(token))
      .send({ nome: '   ', descricao: 'x' });
    expect(r.status).toBe(400);
    expect(r.body.erro).toMatch(/Nome é obrigatório/i);
  });

  // ----------------------
  //  PUT /tarefas/:id
  // ----------------------
  test('atualiza tarefa existente (200)', async () => {
    const login = await request(app).post('/login').send({ senha: '123' });
    const token = login.body.token;

    const r = await request(app)
      .put('/tarefas/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Pão francês', descricao: 'Padaria pão demais' });

    expect(r.status).toBe(200);
    expect(r.body.nome).toBe('Pão francês');
    expect(r.body.descricao).toBe('Padaria pão demais');
  });

  test('tenta atualizar tarefa inexistente (404)', async () => {
    const login = await request(app).post('/login').send({ senha: '123' });
    const token = login.body.token;

    const r = await request(app)
      .put('/tarefas/224')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Pão francês', descricao: 'Padaria pão demais' });

    expect(r.status).toBe(404);
    expect(r.body.erro).toBe('Tarefa não encontrada.');
  });

  test('atualiza tarefa existente com nome muito longo (400)', async () => {
    const login = await request(app).post('/login').send({ senha: '123' });
    const token = login.body.token;
    const nome = "A".repeat(51);

    const r = await request(app)
      .put('/tarefas/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: nome, descricao: 'Padaria pão demais' });

    expect(r.status).toBe(400);
    expect(r.body.erro).toBe('Nome com muitos caracteres.');
  });

  // ----------------------
  //  DELETE /tarefas/:id
  // ----------------------
  test('deleta tarefa (204) e some da lista', async () => {
    const login = await request(app).post('/login').send({ senha: '123' });
    const token = login.body.token;

    const del = await request(app)
      .delete('/tarefas/2')
      .set('Authorization', `Bearer ${token}`);

    expect(del.status).toBe(204);

    // Após deletar, a listagem deve refletir a remoção
    const list = await request(app)
      .get('/tarefas')
      .set('Authorization', `Bearer ${token}`);

    // agora só 1 item
    expect(list.body).toHaveLength(1);
    expect(list.body.find(t => t.id === '2')).toBeUndefined();
  });

  test('tenta deletar tarefa inexistente (404)', async () => {
    const login = await request(app).post('/login').send({ senha: '123' });
    const token = login.body.token;

    const del = await request(app)
      .delete('/tarefas/224')
      .set('Authorization', `Bearer ${token}`);

    expect(del.status).toBe(404);
    expect(del.body.erro).toBe('Tarefa não encontrada.');
  });

  // ----------------------
  //  Casos de erro de autenticação
  // ----------------------
  test('Bearer malformado → 401', async () => {
    const token = await loginOk();
    const r = await request(app)
      .get('/tarefas')
      .set('Authorization', `Bearerrr ${token}`); // malformado
    expect(r.status).toBe(401);
    expect(r.body.erro).toMatch(/Token ausente ou malformado/i);
  });

  test('Token inválido → 401', async () => {
    const r = await request(app)
      .get('/tarefas')
      .set('Authorization', 'Bearer abc.def.ghi');
    expect(r.status).toBe(401);
    expect(r.body.erro).toMatch(/Token.*inválido/i);
  });
});



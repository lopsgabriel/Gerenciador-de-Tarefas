# Gerenciador de Tarefas

Aplicação **Full-Stack** (Node.js + React/Vite) para gerenciar tarefas com autenticação simples (senha + JWT).

## ✨ Funcionalidades

- Login com senha única → retorna **JWT** (expira em 12h).  
- CRUD de tarefas: **criar, listar, editar e excluir**.  
- Busca de tarefas com **fuzzy search** (mesmo com erros de digitação).  
- Cards de tarefas com **expansão/retração** para descrições longas.  
- Feedback de erros com **alerta visual**.  
- Testes automatizados de API (Jest + Supertest).  

## 🚀 Tecnologias

- **Back-end**: Node.js, Express, JWT, Jest, Supertest  
- **Front-end**: Vite, React, Redux Toolkit, React Router, TailwindCSS, Material UI  

## ⚙️ Variáveis de Ambiente

### Servidor (`servidor/.env`)
```env
PORTA=7000
ORIGEM=http://localhost:5173
JWT_SECRET=escolha-uma-senha-segura
APP_PASSWORD=defina-uma-senha-de-acesso
```

> ⚠️ **Atenção:**  
> - `JWT_SECRET` deve ser um valor **único e difícil de adivinhar** (ex.: string longa e aleatória).  
> - `APP_PASSWORD` é a senha que será usada para acessar o sistema. Defina a sua antes de iniciar o servidor.  

### Front-End (`Front-End/.env`)
```env
VITE_API_URL=http://localhost:7000
```

## ▶️ Executando o projeto

### 1) Clonar repositório
```bash
git clone https://github.com/lopsgabriel/Gerenciador-de-Tarefas.git
cd Gerenciador-de-Tarefas
```

### 2) Backend
```bash
cd servidor
cp .env.example .env
npm install
npm run dev   # ou npm start
```
Servidor rodará em: **http://localhost:7000**

### 3) Frontend
Em outro terminal:
```bash
cd Front-End
cp .env.example .env
npm install
npm run dev
```
Front rodará em: **http://localhost:5173**

> Use a senha definida em `APP_PASSWORD` no servidor para login.

## 🧪 Testes

No diretório do servidor:
```bash
npm test
```

Testes cobrem login, CRUD de tarefas e erros de autenticação.

---

## 📜 Licença
Livre para uso acadêmico e portfólio.  

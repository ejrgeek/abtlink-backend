# AbtLink Backend

API Express do AbtLink para autenticacao, links curtos, QR Code, planos, redirecionamento, metricas basicas de clique e administracao.

## Requisitos

- Node.js 22.x
- npm
- Banco PostgreSQL, recomendado NeonDB

## Primeira execucao

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
copy .env.example .env
```

Configure no `.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
JWT_SECRET="um-segredo-com-pelo-menos-32-caracteres"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
SHORT_DOMAIN="http://localhost:3000"
ADMIN_EMAIL=""
ADMIN_PASSWORD=""
```

Gere o Prisma Client:

```bash
npm run prisma:generate
```

Aplique as migrations no banco configurado:

```bash
npm run prisma:migrate:deploy
```

Crie dados iniciais:

```bash
npm run prisma:seed
```

Suba a API:

```bash
npm run dev
```

API local:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/api/docs
```

Health check:

```text
http://localhost:3000/api/health
```

## Criar admin inicial

Para criar um administrador pelo seed, preencha no `.env`:

```env
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="senha-admin-forte"
```

Depois rode:

```bash
npm run prisma:seed
```

O cadastro publico em `/api/auth/register` sempre cria usuario `CUSTOMER`. Ele nao aceita `role` do corpo da requisicao.

## Scripts

```bash
npm run dev
```

Sobe a API local com `node --watch`.

```bash
npm run start
```

Sobe a API sem watch.

```bash
npm run prisma:generate
```

Gera o Prisma Client.

```bash
npm run prisma:migrate:dev
```

Cria e aplica migration em desenvolvimento. Use quando alterar `prisma/schema.prisma` localmente.

```bash
npm run prisma:migrate:deploy
```

Aplica migrations existentes. Use em producao, Vercel ou quando pegar o projeto pronto.

```bash
npm run prisma:studio
```

Abre o Prisma Studio.

```bash
npm run prisma:seed
```

Executa `prisma/seed.js`.

```bash
npm run vercel-build
```

Executa `prisma generate && prisma migrate deploy`.

```bash
npm run audit
```

Verifica vulnerabilidades.

## Rotas principais

Publicas:

```text
GET  /api/health
GET  /api/docs
GET  /api/docs.json
POST /api/auth/register
POST /api/auth/login
GET  /api/plans
GET  /:username/:slug
```

Autenticadas:

```text
GET  /api/auth/me
POST /api/links
GET  /api/links
```

Admin:

```text
GET    /api/admin/overview
GET    /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id
DELETE /api/admin/users/:id
GET    /api/admin/links
GET    /api/admin/links/:id
PATCH  /api/admin/links/:id
DELETE /api/admin/links/:id
GET    /api/admin/plans
POST   /api/admin/plans
GET    /api/admin/plans/:id
PATCH  /api/admin/plans/:id
DELETE /api/admin/plans/:id
```

## Teste rapido

Com a API rodando:

```bash
curl http://localhost:3000/api/health
```

Cadastro:

```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Teste\",\"email\":\"teste@example.com\",\"username\":\"teste\",\"password\":\"senha12345\"}"
```

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"teste@example.com\",\"password\":\"senha12345\"}"
```

Criar link:

```bash
curl -X POST http://localhost:3000/api/links ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"originalUrl\":\"https://example.com\",\"slug\":\"meu-link\",\"title\":\"Meu link\"}"
```

## Vercel

Configure o projeto da Vercel com:

```text
Root Directory: backend
Install Command: npm install
Build Command: npm run vercel-build
Node.js: 22.x
```

Cadastre as variaveis de ambiente no painel:

```text
NODE_ENV=production
DATABASE_URL=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://url-do-frontend.vercel.app
SHORT_DOMAIN=https://url-do-backend.vercel.app
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## Problemas comuns

### Swagger nao carrega CSS ou JS

Instale as dependencias na maquina atual. Nao copie `node_modules` de outra maquina.

```bash
npm install
npm run prisma:generate
npm run dev
```

Se ainda falhar, limpe e reinstale:

```bash
rmdir /s /q node_modules
del package-lock.json
npm install
npm run prisma:generate
npm run dev
```

### Erro de `DATABASE_URL`

Verifique se existe `.env` e se `DATABASE_URL` esta preenchida.

### Erro de `JWT_SECRET`

Use um valor com pelo menos 32 caracteres.

### Banco nao tem tabelas

Rode:

```bash
npm run prisma:migrate:deploy
```

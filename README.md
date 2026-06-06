# ZYX Logística

Sistema web para digitalização dos processos logísticos da ZYX.

## Tecnologias

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: .NET 8 ASP.NET Core Web API
- **Banco de dados**: SQLite (Entity Framework Core)

## Como executar

**Backend**
```bash
cd backend
dotnet run
```
Disponível em `http://localhost:5000` — Swagger em `http://localhost:5000/swagger`

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Disponível em `http://localhost:3000`

> O banco é criado automaticamente com dados de exemplo na primeira execução.

## Módulos

| Módulo | Descrição |
|--------|-----------|
| Motoristas | Cadastro e gestão de motoristas |
| Rotas | Origem, destino e tempo estimado |
| Remessas | Rastreamento completo de entregas |

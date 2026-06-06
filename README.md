# ZYX Logística - Sistema de Gestão Logística

Sistema completo de digitalização de processos logísticos para a empresa ZYX, desenvolvido com .NET 8 e Next.js 14.

## Visão Geral

A aplicação permite gerenciar motoristas, rotas e remessas em tempo real, com dashboard de estatísticas e rastreamento completo de entregas.

## Tecnologias

- **Backend**: .NET 8 ASP.NET Core Web API
- **Banco de dados**: SQLite via Entity Framework Core 8
- **Documentação de API**: Swagger/OpenAPI
- **Frontend**: Next.js 14 com TypeScript
- **Estilos**: Tailwind CSS
- **Ícones**: Lucide React

## Como Executar

### Backend

```bash
cd backend
dotnet run
```

O backend iniciará em `http://localhost:5000`. Swagger disponível em `http://localhost:5000/swagger`.

O banco SQLite (`zyx_logistica.db`) é criado automaticamente e populado com dados de exemplo (5 motoristas, 5 rotas, 10 remessas).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend iniciará em `http://localhost:3000`.

## Endpoints da API

### Motoristas (`/api/motoristas`)

| Método | Rota                   | Descrição               |
|--------|------------------------|-------------------------|
| GET    | /api/motoristas        | Listar todos            |
| GET    | /api/motoristas/{id}   | Buscar por ID           |
| POST   | /api/motoristas        | Criar novo motorista    |
| PUT    | /api/motoristas/{id}   | Atualizar motorista     |
| DELETE | /api/motoristas/{id}   | Excluir motorista       |

### Rotas (`/api/rotas`)

| Método | Rota              | Descrição         |
|--------|-------------------|-------------------|
| GET    | /api/rotas        | Listar todas      |
| GET    | /api/rotas/{id}   | Buscar por ID     |
| POST   | /api/rotas        | Criar nova rota   |
| PUT    | /api/rotas/{id}   | Atualizar rota    |
| DELETE | /api/rotas/{id}   | Excluir rota      |

### Remessas (`/api/remessas`)

| Método | Rota                    | Descrição              |
|--------|-------------------------|------------------------|
| GET    | /api/remessas           | Listar todas           |
| GET    | /api/remessas/{id}      | Buscar por ID          |
| GET    | /api/remessas/stats     | Estatísticas gerais    |
| POST   | /api/remessas           | Criar nova remessa     |
| PUT    | /api/remessas/{id}      | Atualizar remessa      |
| DELETE | /api/remessas/{id}      | Excluir remessa        |

## Estrutura de Pastas

```
ZYX-Dhl/
├── backend/
│   ├── Controllers/
│   │   ├── DriversController.cs      # CRUD motoristas
│   │   ├── RoutesController.cs       # CRUD rotas
│   │   └── ShipmentsController.cs    # CRUD remessas + stats
│   ├── Data/
│   │   └── AppDbContext.cs           # EF Core DbContext
│   ├── Models/
│   │   ├── Driver.cs                 # Modelo Motorista
│   │   ├── Route.cs                  # Modelo Rota
│   │   └── Shipment.cs               # Modelo Remessa
│   ├── Program.cs                    # Configuração + seed de dados
│   └── ZyxLogistica.Api.csproj
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── layout.tsx            # Layout com sidebar
│   │   │   ├── globals.css
│   │   │   ├── motoristas/page.tsx   # CRUD Motoristas
│   │   │   ├── rotas/page.tsx        # CRUD Rotas
│   │   │   └── remessas/page.tsx     # CRUD Remessas
│   │   ├── components/
│   │   │   └── Sidebar.tsx           # Navegação lateral
│   │   └── lib/
│   │       └── api.ts                # Cliente de API tipado
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

## Funcionalidades

- **Dashboard**: Cards com total de motoristas ativos, rotas ativas, remessas por status e taxa de entrega. Tabela de remessas recentes.
- **Motoristas**: Listagem, criação, edição e exclusão de motoristas. Status Ativo/Inativo com badges coloridos.
- **Rotas**: Gestão de rotas com origem, destino, distância e tempo estimado.
- **Remessas**: Rastreamento completo com código de rastreio, motorista, rota, remetente, destinatário, peso e status. Filtro por status.
- **Validações**: Formulários com validação client-side e mensagens de erro do servidor.
- **Seed automático**: Banco populado com 5 motoristas, 5 rotas e 10 remessas de exemplo.


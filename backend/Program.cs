using Microsoft.EntityFrameworkCore;
using ZyxLogistica.Data;
using ZyxLogistica.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=zyx_logistica.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "ZYX Logistica API", Version = "v1" });
});

var app = builder.Build();

// Migrate and seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Motoristas.Any())
    {
        var motoristas = new List<Driver>
        {
            new Driver { Nome = "Carlos Silva", CNH = "12345678901", Telefone = "(11) 98765-4321", Email = "carlos.silva@zyx.com", Status = "Ativo", CreatedAt = DateTime.UtcNow.AddDays(-60) },
            new Driver { Nome = "Ana Oliveira", CNH = "23456789012", Telefone = "(21) 97654-3210", Email = "ana.oliveira@zyx.com", Status = "Ativo", CreatedAt = DateTime.UtcNow.AddDays(-45) },
            new Driver { Nome = "Pedro Santos", CNH = "34567890123", Telefone = "(31) 96543-2109", Email = "pedro.santos@zyx.com", Status = "Ativo", CreatedAt = DateTime.UtcNow.AddDays(-30) },
            new Driver { Nome = "Maria Costa", CNH = "45678901234", Telefone = "(41) 95432-1098", Email = "maria.costa@zyx.com", Status = "Inativo", CreatedAt = DateTime.UtcNow.AddDays(-90) },
            new Driver { Nome = "João Ferreira", CNH = "56789012345", Telefone = "(51) 94321-0987", Email = "joao.ferreira@zyx.com", Status = "Ativo", CreatedAt = DateTime.UtcNow.AddDays(-15) },
        };
        db.Motoristas.AddRange(motoristas);
        db.SaveChanges();

        var rotas = new List<Route>
        {
            new Route { Nome = "SP-RJ Expressa", Origem = "São Paulo, SP", Destino = "Rio de Janeiro, RJ", DistanciaKm = 430, TempoEstimadoHoras = 5.5, Status = "Ativa", CreatedAt = DateTime.UtcNow.AddDays(-60) },
            new Route { Nome = "SP-BH Principal", Origem = "São Paulo, SP", Destino = "Belo Horizonte, MG", DistanciaKm = 586, TempoEstimadoHoras = 7, Status = "Ativa", CreatedAt = DateTime.UtcNow.AddDays(-50) },
            new Route { Nome = "RJ-ES Litoral", Origem = "Rio de Janeiro, RJ", Destino = "Vitória, ES", DistanciaKm = 520, TempoEstimadoHoras = 6.5, Status = "Ativa", CreatedAt = DateTime.UtcNow.AddDays(-40) },
            new Route { Nome = "SP-CTB Sul", Origem = "São Paulo, SP", Destino = "Curitiba, PR", DistanciaKm = 408, TempoEstimadoHoras = 5, Status = "Ativa", CreatedAt = DateTime.UtcNow.AddDays(-35) },
            new Route { Nome = "BH-SSA Nordeste", Origem = "Belo Horizonte, MG", Destino = "Salvador, BA", DistanciaKm = 1370, TempoEstimadoHoras = 16, Status = "Inativa", CreatedAt = DateTime.UtcNow.AddDays(-25) },
        };
        db.Rotas.AddRange(rotas);
        db.SaveChanges();

        var motoristasIds = db.Motoristas.Select(m => m.Id).ToList();
        var rotasIds = db.Rotas.Select(r => r.Id).ToList();

        var remessas = new List<Shipment>
        {
            new Shipment { CodigoRastreio = "ZYX202401001", MotoristaId = motoristasIds[0], RotaId = rotasIds[0], Status = "Entregue", PesoKg = 15.5, Descricao = "Eletrônicos frágeis", NomeRemetente = "Tech Store SP", NomeDestinatario = "Carlos Mendes", EnderecoDestino = "Rua das Flores, 123, Rio de Janeiro, RJ", CreatedAt = DateTime.UtcNow.AddDays(-20), EntregueEm = DateTime.UtcNow.AddDays(-19) },
            new Shipment { CodigoRastreio = "ZYX202401002", MotoristaId = motoristasIds[1], RotaId = rotasIds[1], Status = "EmTransito", PesoKg = 32.0, Descricao = "Móveis desmontados", NomeRemetente = "Casa & Cia", NomeDestinatario = "Ana Lima", EnderecoDestino = "Av. Afonso Pena, 456, Belo Horizonte, MG", CreatedAt = DateTime.UtcNow.AddDays(-5) },
            new Shipment { CodigoRastreio = "ZYX202401003", MotoristaId = motoristasIds[2], RotaId = rotasIds[2], Status = "Pendente", PesoKg = 8.2, Descricao = "Livros e materiais didáticos", NomeRemetente = "Livraria Central", NomeDestinatario = "Roberto Alves", EnderecoDestino = "Rua da Praia, 789, Vitória, ES", CreatedAt = DateTime.UtcNow.AddDays(-2) },
            new Shipment { CodigoRastreio = "ZYX202401004", MotoristaId = motoristasIds[0], RotaId = rotasIds[3], Status = "Entregue", PesoKg = 55.0, Descricao = "Equipamentos industriais", NomeRemetente = "Indústria ABC", NomeDestinatario = "Paulo Ramos", EnderecoDestino = "Av. Batel, 321, Curitiba, PR", CreatedAt = DateTime.UtcNow.AddDays(-15), EntregueEm = DateTime.UtcNow.AddDays(-14) },
            new Shipment { CodigoRastreio = "ZYX202401005", MotoristaId = motoristasIds[1], RotaId = rotasIds[0], Status = "Cancelado", PesoKg = 12.3, Descricao = "Roupas e acessórios", NomeRemetente = "Fashion Store", NomeDestinatario = "Lucia Souza", EnderecoDestino = "Rua Ipanema, 654, Rio de Janeiro, RJ", CreatedAt = DateTime.UtcNow.AddDays(-10) },
            new Shipment { CodigoRastreio = "ZYX202401006", MotoristaId = motoristasIds[4], RotaId = rotasIds[1], Status = "EmTransito", PesoKg = 28.7, Descricao = "Alimentos não perecíveis", NomeRemetente = "Distribuidora Norte", NomeDestinatario = "Supermercado Central", EnderecoDestino = "Rua Contorno, 987, Belo Horizonte, MG", CreatedAt = DateTime.UtcNow.AddDays(-3) },
            new Shipment { CodigoRastreio = "ZYX202401007", MotoristaId = motoristasIds[2], RotaId = rotasIds[3], Status = "Pendente", PesoKg = 6.5, Descricao = "Medicamentos", NomeRemetente = "Pharma Sul", NomeDestinatario = "Drogaria Saúde", EnderecoDestino = "Rua XV de Novembro, 147, Curitiba, PR", CreatedAt = DateTime.UtcNow.AddDays(-1) },
            new Shipment { CodigoRastreio = "ZYX202401008", MotoristaId = motoristasIds[0], RotaId = rotasIds[2], Status = "Entregue", PesoKg = 42.1, Descricao = "Materiais de construção", NomeRemetente = "Construmax", NomeDestinatario = "Construtora Vitória", EnderecoDestino = "Av. Nossa Senhora da Penha, 258, Vitória, ES", CreatedAt = DateTime.UtcNow.AddDays(-25), EntregueEm = DateTime.UtcNow.AddDays(-23) },
            new Shipment { CodigoRastreio = "ZYX202401009", MotoristaId = motoristasIds[4], RotaId = rotasIds[0], Status = "EmTransito", PesoKg = 19.8, Descricao = "Equipamentos de informática", NomeRemetente = "Tech Solutions", NomeDestinatario = "Empresa Digital RJ", EnderecoDestino = "Av. Rio Branco, 369, Rio de Janeiro, RJ", CreatedAt = DateTime.UtcNow.AddDays(-4) },
            new Shipment { CodigoRastreio = "ZYX202401010", MotoristaId = motoristasIds[1], RotaId = rotasIds[3], Status = "Pendente", PesoKg = 11.0, Descricao = "Artigos esportivos", NomeRemetente = "Sport Center", NomeDestinatario = "Academia Fitness PR", EnderecoDestino = "Rua Voluntários da Pátria, 741, Curitiba, PR", CreatedAt = DateTime.UtcNow },
        };
        db.Remessas.AddRange(remessas);
        db.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run("http://localhost:5000");

using Microsoft.EntityFrameworkCore;
using ZyxLogistica.Models;

namespace ZyxLogistica.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Driver> Motoristas { get; set; }
    public DbSet<Route> Rotas { get; set; }
    public DbSet<Shipment> Remessas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Shipment>()
            .HasOne(s => s.Motorista)
            .WithMany(d => d.Remessas)
            .HasForeignKey(s => s.MotoristaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Shipment>()
            .HasOne(s => s.Rota)
            .WithMany(r => r.Remessas)
            .HasForeignKey(s => s.RotaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

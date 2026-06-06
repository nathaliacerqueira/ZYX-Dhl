using System.ComponentModel.DataAnnotations;

namespace ZyxLogistica.Models;

public class Route
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Origem { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Destino { get; set; } = string.Empty;

    public double DistanciaKm { get; set; }

    public double TempoEstimadoHoras { get; set; }

    [Required]
    public string Status { get; set; } = "Ativa";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Shipment> Remessas { get; set; } = new List<Shipment>();
}

using System.ComponentModel.DataAnnotations;

namespace ZyxLogistica.Models;

public class Shipment
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string CodigoRastreio { get; set; } = string.Empty;

    public int MotoristaId { get; set; }
    public Driver? Motorista { get; set; }

    public int RotaId { get; set; }
    public Route? Rota { get; set; }

    [Required]
    public string Status { get; set; } = "Pendente";

    public double PesoKg { get; set; }

    [MaxLength(500)]
    public string? Descricao { get; set; }

    [Required]
    [MaxLength(200)]
    public string NomeRemetente { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string NomeDestinatario { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string EnderecoDestino { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? EntregueEm { get; set; }
}

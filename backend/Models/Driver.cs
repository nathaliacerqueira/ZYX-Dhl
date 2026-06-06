using System.ComponentModel.DataAnnotations;

namespace ZyxLogistica.Models;

public class Driver
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string CNH { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Telefone { get; set; }

    [MaxLength(200)]
    public string? Email { get; set; }

    [Required]
    public string Status { get; set; } = "Ativo";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Shipment> Remessas { get; set; } = new List<Shipment>();
}

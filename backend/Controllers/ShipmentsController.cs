using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZyxLogistica.Data;
using ZyxLogistica.Models;

namespace ZyxLogistica.Controllers;

[ApiController]
[Route("api/remessas")]
public class ShipmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ShipmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Shipment>>> GetAll()
    {
        return await _context.Remessas
            .Include(r => r.Motorista)
            .Include(r => r.Rota)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Shipment>> GetById(int id)
    {
        var shipment = await _context.Remessas
            .Include(r => r.Motorista)
            .Include(r => r.Rota)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (shipment == null) return NotFound();
        return shipment;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetStats()
    {
        var total = await _context.Remessas.CountAsync();
        var pendentes = await _context.Remessas.CountAsync(r => r.Status == "Pendente");
        var emTransito = await _context.Remessas.CountAsync(r => r.Status == "EmTransito");
        var entregues = await _context.Remessas.CountAsync(r => r.Status == "Entregue");
        var cancelados = await _context.Remessas.CountAsync(r => r.Status == "Cancelado");
        var motoristasAtivos = await _context.Motoristas.CountAsync(m => m.Status == "Ativo");
        var rotasAtivas = await _context.Rotas.CountAsync(r => r.Status == "Ativa");

        return Ok(new
        {
            total,
            pendentes,
            emTransito,
            entregues,
            cancelados,
            motoristasAtivos,
            rotasAtivas
        });
    }

    [HttpPost]
    public async Task<ActionResult<Shipment>> Create([FromBody] Shipment shipment)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var driverExists = await _context.Motoristas.AnyAsync(m => m.Id == shipment.MotoristaId);
        if (!driverExists) return BadRequest("Motorista não encontrado.");

        var routeExists = await _context.Rotas.AnyAsync(r => r.Id == shipment.RotaId);
        if (!routeExists) return BadRequest("Rota não encontrada.");

        shipment.CreatedAt = DateTime.UtcNow;
        if (shipment.Status == "Entregue" && shipment.EntregueEm == null)
            shipment.EntregueEm = DateTime.UtcNow;

        _context.Remessas.Add(shipment);
        await _context.SaveChangesAsync();

        var created = await _context.Remessas
            .Include(r => r.Motorista)
            .Include(r => r.Rota)
            .FirstAsync(r => r.Id == shipment.Id);

        return CreatedAtAction(nameof(GetById), new { id = shipment.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Shipment shipment)
    {
        if (id != shipment.Id) return BadRequest("ID mismatch");
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var existing = await _context.Remessas.FindAsync(id);
        if (existing == null) return NotFound();

        var driverExists = await _context.Motoristas.AnyAsync(m => m.Id == shipment.MotoristaId);
        if (!driverExists) return BadRequest("Motorista não encontrado.");

        var routeExists = await _context.Rotas.AnyAsync(r => r.Id == shipment.RotaId);
        if (!routeExists) return BadRequest("Rota não encontrada.");

        existing.CodigoRastreio = shipment.CodigoRastreio;
        existing.MotoristaId = shipment.MotoristaId;
        existing.RotaId = shipment.RotaId;
        existing.Status = shipment.Status;
        existing.PesoKg = shipment.PesoKg;
        existing.Descricao = shipment.Descricao;
        existing.NomeRemetente = shipment.NomeRemetente;
        existing.NomeDestinatario = shipment.NomeDestinatario;
        existing.EnderecoDestino = shipment.EnderecoDestino;

        if (shipment.Status == "Entregue" && existing.EntregueEm == null)
            existing.EntregueEm = DateTime.UtcNow;
        else if (shipment.Status != "Entregue")
            existing.EntregueEm = null;

        await _context.SaveChangesAsync();

        var updated = await _context.Remessas
            .Include(r => r.Motorista)
            .Include(r => r.Rota)
            .FirstAsync(r => r.Id == id);

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var shipment = await _context.Remessas.FindAsync(id);
        if (shipment == null) return NotFound();

        _context.Remessas.Remove(shipment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

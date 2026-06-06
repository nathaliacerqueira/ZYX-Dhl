using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZyxLogistica.Data;
using ZyxLogistica.Models;

namespace ZyxLogistica.Controllers;

[ApiController]
[Route("api/rotas")]
public class RoutesController : ControllerBase
{
    private readonly AppDbContext _context;

    public RoutesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Route>>> GetAll()
    {
        return await _context.Rotas.OrderByDescending(r => r.CreatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Route>> GetById(int id)
    {
        var route = await _context.Rotas.FindAsync(id);
        if (route == null) return NotFound();
        return route;
    }

    [HttpPost]
    public async Task<ActionResult<Route>> Create([FromBody] Route route)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        route.CreatedAt = DateTime.UtcNow;
        _context.Rotas.Add(route);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = route.Id }, route);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Route route)
    {
        if (id != route.Id) return BadRequest("ID mismatch");
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var existing = await _context.Rotas.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Nome = route.Nome;
        existing.Origem = route.Origem;
        existing.Destino = route.Destino;
        existing.DistanciaKm = route.DistanciaKm;
        existing.TempoEstimadoHoras = route.TempoEstimadoHoras;
        existing.Status = route.Status;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var route = await _context.Rotas.FindAsync(id);
        if (route == null) return NotFound();

        var hasShipments = await _context.Remessas.AnyAsync(r => r.RotaId == id);
        if (hasShipments)
            return BadRequest("Não é possível excluir rota com remessas associadas.");

        _context.Rotas.Remove(route);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

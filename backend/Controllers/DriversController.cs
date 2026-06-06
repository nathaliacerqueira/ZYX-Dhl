using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZyxLogistica.Data;
using ZyxLogistica.Models;

namespace ZyxLogistica.Controllers;

[ApiController]
[Route("api/motoristas")]
public class DriversController : ControllerBase
{
    private readonly AppDbContext _context;

    public DriversController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Driver>>> GetAll()
    {
        return await _context.Motoristas.OrderByDescending(m => m.CreatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Driver>> GetById(int id)
    {
        var driver = await _context.Motoristas.FindAsync(id);
        if (driver == null) return NotFound();
        return driver;
    }

    [HttpPost]
    public async Task<ActionResult<Driver>> Create([FromBody] Driver driver)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        driver.CreatedAt = DateTime.UtcNow;
        _context.Motoristas.Add(driver);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = driver.Id }, driver);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Driver driver)
    {
        if (id != driver.Id) return BadRequest("ID mismatch");
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var existing = await _context.Motoristas.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Nome = driver.Nome;
        existing.CNH = driver.CNH;
        existing.Telefone = driver.Telefone;
        existing.Email = driver.Email;
        existing.Status = driver.Status;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var driver = await _context.Motoristas.FindAsync(id);
        if (driver == null) return NotFound();

        var hasShipments = await _context.Remessas.AnyAsync(r => r.MotoristaId == id);
        if (hasShipments)
            return BadRequest("Não é possível excluir motorista com remessas associadas.");

        _context.Motoristas.Remove(driver);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

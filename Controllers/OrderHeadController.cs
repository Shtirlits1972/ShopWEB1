using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopWEB1.Models;

namespace ShopWEB1.Controllers
{
    public class OrderHeadViewController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]
    public class OrderHeadController : ControllerBase
    {
        private readonly DataContext _context;

        public OrderHeadController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
        public ActionResult<IEnumerable<OrderHead>> GetOrderHead()
        {
            if (_context.OrderHeads == null)
            {
                return NotFound();
            }

            try
            {
                //  .Include(x => x.user)
                return _context.OrderHeads.Include(x => x.User).ToList();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return NotFound(ex.Message);
            }
            return NotFound();
        }

        // GET: api/OrderHead/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderHead>> GetOrderHead(int id)
        {
            if (_context.OrderHeads == null)
            {
                return NotFound();
            }

            var orderHead = await _context.OrderHeads.Include(x => x.User).Where(x => x.Id == id).FirstOrDefaultAsync();

            if (orderHead == null)
            {
                return NotFound();
            }

            return orderHead;
        }

        // POST api/<OrderHeadController>
        [HttpPost]
        public async Task<ActionResult<OrderHead>> PostOrderHead(OrderHead orderHead)
        {
            if (_context.OrderHeads == null)
            {
                return Problem("Entity set 'DataContext.orderHeads'  is null.");
            }
            _context.OrderHeads.Add(orderHead);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrderHead", new { id = orderHead.Id }, orderHead);
        }

        // PUT api/<OrderHeadController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderHead(int id, OrderHead OrderHead)
        {
            if (id != OrderHead.Id)
            {
                return BadRequest();
            }

            _context.Entry(OrderHead).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderHeadExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool OrderHeadExists(int id)
        {
            return (_context.OrderHeads?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        // DELETE api/OrderHead/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderHead(int id)
        {
            if (_context.OrderHeads == null)
            {
                return NotFound();
            }
            var orderHead = await _context.OrderHeads.FindAsync(id);
            if (orderHead == null)
            {
                return NotFound();
            }

            _context.OrderHeads.Remove(orderHead);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopWEB1.Models;

namespace ShopWEB1.Controllers
{

    public class ProductsViewController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly DataContext _context;

        public ProductsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            if (_context.Products == null)
            {
                return NotFound();
            }

            List<Product> list = _context.Products.Include(x => x.category).ToList();

            return Ok(list);
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public ActionResult<Product> GetProduct(int id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = _context.Products.Include(x => x.category).Where(y => y.Id == id).FirstOrDefault();

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public IActionResult PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
                return Ok(product);
            }
            catch (System.Data.Entity.Infrastructure.DbUpdateConcurrencyException ex)
            {
                NotFound(ex);
            }

            return NoContent();
        }

        // POST: api/Products
        [HttpPost]
        public ActionResult<Product> PostProduct(Product product)
        {
            if (_context.Products == null)
            {
                return Problem("Entity set 'DataContext.Products'  is null.");
            }
            _context.Entry(product.category).State = EntityState.Unchanged;
            _context.Products.Add(product);

            try
            {
                _context.SaveChanges();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException u)
            {
                Console.WriteLine(u.Message);
                return StatusCode(StatusCodes.Status418ImATeapot, u.InnerException);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            _context.SaveChanges();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return (_context.Products?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}

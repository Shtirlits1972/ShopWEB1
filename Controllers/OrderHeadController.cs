using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopWEB1.Models;

namespace ShopWEB1.Controllers
{
    [Authorize]
    public class OrderHeadViewController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
                if (User.IsInRole("admin"))
                {
                    return _context.OrderHeads.Include(x => x.User).ToList();
                }
               else
                {
                    int UserId = int.Parse(User.Claims.ToList()[3].Value);
                    return _context.OrderHeads.Where(x => x.UserId == UserId).Include(x => x.User).ToList();
                }
                    
            }
            catch (Exception ex)
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

            OrderHead orderHead = new OrderHead { Id = 0, OrderNumber = "00000", OrderData = DateTime.Today, User = null, UserId = 0 };
            int UserId = 0;


            if (id == 0)
            {
                Users OrderUser = null;
                if (User.Identity.IsAuthenticated)
                {
                    UserId = int.Parse(User.Claims.ToList()[3].Value);
                    OrderUser = _context.Users.Where(x => x.id == UserId).FirstOrDefault();
                }
                else
                {
                    Console.WriteLine("Пользователь не авторизован!");
                }

                DateTime dateTimeToday = DateTime.Today;
                string OrderNumber = dateTimeToday.ToShortDateString() + "/" + (_context.OrderHeads.Where(x => x.OrderData == dateTimeToday).Count() + 1).ToString();

                orderHead = new OrderHead { Id = 0, OrderNumber = OrderNumber.ToString(), UserId = UserId, User = OrderUser, OrderData = dateTimeToday };
            }
            else if (id > 0)
            {
                orderHead = await _context.OrderHeads.Include(x => x.User).Where(x => x.Id == id).FirstOrDefaultAsync();
            }

            if (orderHead == null)
            {
                return NotFound();
            }

            return orderHead;
        }


        //   Добавляем новую шапку документа
        // POST api/<OrderHeadController>
        [HttpPost]
        public ActionResult<OrderHead> PostOrderHead(OrderHead orderHead)
        {
            orderHead.User = null; //  без этого не работает   :-(

            if (orderHead.UserId == 0)
            {
                if (User.Identity.IsAuthenticated)
                {
                    orderHead.UserId = int.Parse(User.Claims.ToList()[3].Value);
                }
            }

            if (_context.OrderHeads == null)
            {
                return Problem("Entity set 'DataContext.orderHeads'  is null.");
            }
            _context.OrderHeads.Add(orderHead);
            _context.SaveChanges();

            return CreatedAtAction("GetOrderHead", new { id = orderHead.Id }, orderHead);
        }


        //  Редактируем
        // PUT api/<OrderHeadController>/5
        [HttpPut("{id}")]
        public IActionResult PutOrderHead(int id, OrderHead OrderHead)
        {
            if (id != OrderHead.Id)
            {
                return BadRequest();
            }

            _context.Entry(OrderHead).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
                return CreatedAtAction("GetOrderHead", new { id = OrderHead.Id }, OrderHead);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!OrderHeadExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(500, ex);
                }
            }
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

            List<OrderDetail> listDetail = _context.OrderDetails.Where(e => e.OrderId == orderHead.Id).ToList();

            for (int i = 0; i < listDetail.Count; i++)
            {
                _context.OrderDetails.Remove(listDetail[i]);
            }

            _context.OrderHeads.Remove(orderHead);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

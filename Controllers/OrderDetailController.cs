using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopWEB1.Models;

namespace ShopWEB1.Controllers
{
    [Authorize]
    public class OrderDetailViewController : Controller
    {
        private readonly DataContext _context;
        public OrderDetailViewController(DataContext context)
        {
            _context = context;
        }

        public IActionResult Index(int OrderId = 0)
        {
            int h = 0;
            if (_context.OrderHeads == null)
            {
                return NotFound();
            }

            int UserId = 0;

            //   создаём новый заказ
            if (OrderId == 0)
            {
                if (User.Identity.IsAuthenticated)
                {
                    UserId = int.Parse(User.Claims.ToList()[3].Value);
                    //     users = _context.Users.Where(x => x.id == UserId).FirstOrDefault();
                    int y = 0;
                }
                else
                {
                    return StatusCode(300, "Не авторизованный пользователь не может создавть заказы");
                }
            }

            DateTime dateTimeToday = DateTime.Today;
            string OrderNumber = dateTimeToday.ToShortDateString() + "/" + (_context.OrderHeads.Where(x => x.OrderData == dateTimeToday).Count() + 1).ToString();

            OrderHead orderHead = new OrderHead { Id = 0, OrderNumber = OrderNumber.ToString(), UserId = UserId, User = null, OrderData = dateTimeToday };

            if (OrderId > 0)
            {
                orderHead = _context.OrderHeads.Include(x => x.User).Where(x => x.Id == OrderId).FirstOrDefault();
            }

            return View(orderHead);
        }
    }

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly DataContext _context;

        public OrderDetailController(DataContext context)
        {
            _context = context;
        }

        // GET: api/OrderDetails?OrderHeadId=2
        [HttpGet]
        //[ValidateAntiForgeryToken]
        public ActionResult<IEnumerable<OrderDetail>> GetOrderDetails(int OrderHeadId)
        {
            if (_context.OrderDetails == null)
            {
                return NotFound();
            }
            return _context.OrderDetails.Include(x => x.Product).Where(x => x.OrderId == OrderHeadId).ToList();
        }

        // GET: api/OrderDetails/5
        [HttpGet("{id}")]
        public ActionResult<OrderDetail> GetOneOrderDetails(int id)
        {
            if (_context.OrderDetails == null)
            {
                return NotFound();
            }
            var OrderDetail = _context.OrderDetails.Where(x => x.Id == id).Include(x => x.Product).FirstOrDefault();

            if (OrderDetail == null)
            {
                return NotFound();
            }

            return OrderDetail;
        }

        // PUT: api/OrderDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public IActionResult PutOrderDetail(int id, OrderDetail OrderDetail)
        {
            if (id != OrderDetail.Id)
            {
                return BadRequest();
            }

            _context.Entry(OrderDetail).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderDetailExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(500);
                }
            }

            return NoContent();
        }

        // POST: api/OrderDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<OrderDetail> PostOrderDetail(OrderDetail OrderDetail)
        {
            if (_context.OrderDetails == null)
            {
                return Problem("Entity set 'DataContext.OrderDetails'  is null.");
            }
            _context.OrderDetails.Add(OrderDetail);
            _context.SaveChanges();

            return CreatedAtAction("GetOrderDetail", new { id = OrderDetail.Id }, OrderDetail);
        }

        // DELETE: api/OrderDetails/5
        [HttpDelete("{id}")]
        public IActionResult DeleteOrderDetail(int id)
        {
            if (_context.OrderDetails == null)
            {
                return NotFound();
            }
            var OrderDetail = _context.OrderDetails.Find(id);
            if (OrderDetail == null)
            {
                return NotFound();
            }

            _context.OrderDetails.Remove(OrderDetail);
            _context.SaveChanges();

            return NoContent();
        }

        private bool OrderDetailExists(int id)
        {
            return (_context.OrderDetails?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}

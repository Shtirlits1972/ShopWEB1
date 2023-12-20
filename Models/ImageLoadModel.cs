namespace ShopWEB1.Models
{
    public class ImageLoadModel
    {
        public IFormFile foto { get; set; }
        public int productId { get; set; }
        public bool IsEdit { get; set; }
    }
}

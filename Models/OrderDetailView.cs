namespace ShopWEB1.Models;

public partial class OrderDetailView
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public decimal Qty { get; set; }

    public string? ProductName { get; set; }

    public decimal? Price { get; set; }

    public decimal? RowSum { get; set; }
}

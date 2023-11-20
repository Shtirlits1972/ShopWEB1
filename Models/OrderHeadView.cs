namespace ShopWEB1.Models;

public partial class OrderHeadView
{
    public int Id { get; set; }

    public string? OrderNumber { get; set; }

    public int UserId { get; set; }

    public DateTime? OrderData { get; set; }

    public decimal? TotalPrice { get; set; }
}

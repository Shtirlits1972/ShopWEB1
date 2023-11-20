using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopWEB1.Models;


[Table("OrderDetail")]
public partial class OrderDetail
{
    [Key]
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public decimal Qty { get; set; }

    // [JsonIgnore]
    [InverseProperty("OrderDetails")]
    public virtual OrderHead Order { get; set; } = null!;

    // [JsonIgnore]
    [InverseProperty("OrderDetails")]
    public virtual Product Product { get; set; } = null!;
}

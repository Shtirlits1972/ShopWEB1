using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ShopWEB1.Models;


[Table("OrderHead")]
public partial class OrderHead
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    public string? OrderNumber { get; set; }

    public DateTime? OrderData { get; set; }

    [JsonIgnore]
    //[InverseProperty("OrderHeads")]
    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();



    [InverseProperty("OrderHeads")]
    public virtual Users User { get; set; } = null!;
}

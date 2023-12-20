using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ShopWEB1.Models;


[Table("Product")]
public partial class Product
{
    [Key]
    public int Id { get; set; }

    public string ProductName { get; set; } = null!;

    public decimal Price { get; set; }

    public int CategoryId { get; set; }

    [InverseProperty("Products")]
    public virtual Category category { get; set; } = null!;

    public string Foto { get; set; } = null!;

    [JsonIgnore]
    //[InverseProperty("Products")]
    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}

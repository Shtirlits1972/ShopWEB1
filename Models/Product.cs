using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace ShopWEB1.Models;

[Table("Product")]
public partial class Product
{
    [Key]
    public int Id { get; set; } = 0;

    [StringLength(250)]
    public string productName { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal price { get; set; } = 0;
    public int categoryId { get; set; }

    //  [ForeignKey("CatID")]
    [InverseProperty("Products")]
    public virtual Category? category { get; set; } = null!;

    //[JsonIgnore]
    //[InverseProperty("Products")]
    //public virtual OrderDetail? OrderDetail { get; set; } = null!;
}

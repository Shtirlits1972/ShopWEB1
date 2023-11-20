using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace ShopWEB1.Models;

[Table("Category")]
public partial class Category
{
    [Key]
    public int id { get; set; }

    [StringLength(250)]
    public string categoryName { get; set; }

    public override string ToString()
    {
        return $"id = {id}, categoryName = {categoryName} ";
    }

    [JsonIgnore]
    public virtual ICollection<Product>? Products { get; set; } = new List<Product>();

    //[JsonIgnore]
    //public virtual ICollection<OrderDetail>? OrderDetails { get; set; } = new List<OrderDetail>();

    //[JsonIgnore]
    //public virtual ICollection<OrderHead>? OrderHeads { get; set; } = new List<OrderHead>();
}

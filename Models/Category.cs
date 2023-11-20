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

    public string? categoryName { get; set; }


    public override string ToString()
    {
        return $"id = {id}, categoryName = {categoryName} ";
    }

    [JsonIgnore]
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}

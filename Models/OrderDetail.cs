using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace ShopWEB1.Models;

[Table("OrderDetail")]
public partial class OrderDetail
{
    [Key]
    public int Id { get; set; }
    public int orderId { get; set; }
    public int ProductId { get; set; }
    public decimal Qty { get; set; }
    //        public decimal RowSum { get {
    //                return product.price * Qty;
    //} }

    //[JsonIgnore]
    //[InverseProperty("OrderDetails")]
    //public virtual OrderHead orderHead { get; set; }

    //[InverseProperty("OrderDetails")]
    //public virtual Product product { get; set; }

    //[JsonIgnore]
    //[InverseProperty("OrderDetails")]
    //public virtual Category category { get; set; } = null!;

    public override string ToString()
    {
        return $"Id = {Id}, orderId = {orderId}, ProductId = {ProductId}, Qty = {Qty} ";
    }
}





using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace ShopWEB1.Models;

[Table("OrderHead")]
public partial class OrderHead
{
    [Key]
    public int id { get; set; }

    [StringLength(250)]
    public string orderNumber { get; set; }

    [DataType(DataType.Date)]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd.MM.yyyy}")]
    public DateTime orderData { get; set; }

    public int userId { get; set; }

    [InverseProperty("OrderHeads")]
    public virtual Users? User { get; set; } = null!;


    //[InverseProperty("OrderHeads")]
    //public virtual List<OrderDetail>? OrderDetails { get; set; } = null!;

}

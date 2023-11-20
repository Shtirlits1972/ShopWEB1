using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


//  без этой херни не работает JsonIgnore
// не использовать using Newtonsoft.Json  !!!!!!!!!!!
using System.Text.Json.Serialization;

namespace ShopWEB1.Models;

[Table("Users")]
public partial class Users
{
    [Key]
    public int id { get; set; }

    [StringLength(250)]
    public string Email { get; set; } = null!;

    [StringLength(250)]
    public string Password { get; set; } = null!;

    [StringLength(250)]
    public string Role { get; set; } = null!;

    [StringLength(250)]
    public string UsersName { get; set; } = null!;

    [Required]
    public bool isAppruved { get; set; }   //  isApproved   ---- ???


    [JsonIgnore]
    public virtual ICollection<OrderHead> OrderHeads { get; set; } = new List<OrderHead>();
}

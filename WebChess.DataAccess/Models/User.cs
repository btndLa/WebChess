using Microsoft.AspNetCore.Identity;

namespace WebChess.DataAccess.Models; 

public class User : IdentityUser
{
    public Guid? RefreshToken { get; set; }
}
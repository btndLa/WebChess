using System.ComponentModel.DataAnnotations;

namespace WebChess.Shared.Models
{
    public class LoginRequestDto
    {
        [Required]
        [EmailAddress(ErrorMessage = "Email is invalid")]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }
    }
}
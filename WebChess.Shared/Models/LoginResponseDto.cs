namespace WebChess.Shared.Models
{
    public class LoginResponseDto
    {
        public required string UserId { get; set; }
        public required string AuthToken { get; set; }
        public required string RefreshToken { get; set; }
    }
}
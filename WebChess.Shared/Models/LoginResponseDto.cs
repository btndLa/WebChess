namespace WebChess.Shared.Models
{
    public class LoginResponseDto
    {
        public required string UserId { get; init; }
        public required string UserName { get; init; }
        public required string AuthToken { get; init; }
        public required string RefreshToken { get; init; }
    }
}
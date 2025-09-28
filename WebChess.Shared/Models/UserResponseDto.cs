namespace WebChess.Shared.Models
{
    public class UserResponseDto
    {
        public required string Id { get; init; }
        public required string UserName { get; init; }
        public required string Email { get; init; }
    }
}
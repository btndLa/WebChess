using System.ComponentModel.DataAnnotations;

namespace WebChess.Shared.Models {
	public class UserRequestDto {
		[StringLength(50, MinimumLength = 3, ErrorMessage = "Name is too long")]
		public required string UserName { get; init; }
		[EmailAddress(ErrorMessage = "Invalid email address")]
		public required string Email { get; init; }
		public required string Password { get; init; }
	}
}
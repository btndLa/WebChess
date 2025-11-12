using System.ComponentModel.DataAnnotations;

namespace WebChess.Shared.Models {
	public class LoginRequestDto {
		[Required]
		public required string UserName { get; init; }

		[Required]
		public required string Password { get; init; }
	}
}
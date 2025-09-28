using System.Threading.Tasks;
using WebChess.DataAccess.Models;

namespace WebChess.DataAccess.Services {
	public interface IUserService {
		Task AddUserAsync(User user, string password);
		Task<(string authToken, string refreshToken, string userId)> LoginAsync(string username, string password);
		Task<(string authToken, string refreshToken, string userId)> RedeemRefreshTokenAsync(string refreshToken);
		Task<User?> GetCurrentUserAsync();
		string GetCurrentUserId();
		Task LogoutAsync();
		Task<User?> GetUserByIdAsync(string userId);
	}
}

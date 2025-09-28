using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebChess.DataAccess.Models;

namespace WebChess.DataAccess.Services {
	internal class UserService : IUserService {

		private readonly UserManager<User> _userManager;

		public UserService(UserManager<User> userManager) {
			_userManager = userManager;
		}

		public async Task AddUserAsync(User user, string password) {
			user.RefreshToken = Guid.NewGuid();
			var result = await _userManager.CreateAsync(user, password);
			if (!result.Succeeded) {
				throw new InvalidDataException(string.Join(", ", result.Errors.Select(e => e.Description)));
			}
		}

	}
}

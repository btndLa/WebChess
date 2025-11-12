using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WebChess.DataAccess.Models;
using WebChess.DataAccess.Services;

namespace WebChess.DataAccess {
	public static class DependencyInjection {
		public static IServiceCollection AddDataAccess(this IServiceCollection services, IConfiguration config) {
			// Database
			var connectionString = config.GetConnectionString("DefaultConnection");
			services.AddDbContext<WebChessDbContext>(options => options
				.UseSqlServer(connectionString)
			);

			// Services
			services.AddIdentity<User, IdentityRole>(options =>
			{
				// Password settings.
				options.Password.RequiredLength = 6;
				options.Password.RequireNonAlphanumeric = false;

				// Lockout settings.
				options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
				options.Lockout.MaxFailedAccessAttempts = 5;
				options.Lockout.AllowedForNewUsers = true;
				options.User.RequireUniqueEmail = true;
			})
			.AddEntityFrameworkStores<WebChessDbContext>()
			.AddDefaultTokenProviders();

			services.AddScoped<IUserService, UserService>();
			services.AddScoped<IGameService, GameService>();

			return services;
		}
	}
}

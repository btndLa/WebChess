
using AutoMapper;
using WebChess.WebApi.SignalR.Services;

namespace WebChess.WebApi.Infrastructure {
	public static class DependencyInjection {

		public static IServiceCollection AddAutoMapper(this IServiceCollection services) {
			var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile(new MappingProfile()));
			mapperConfig.AssertConfigurationIsValid();

			services.AddAutoMapper(typeof(MappingProfile));
			return services;
		}

		public static IServiceCollection AddSignalRServices(this IServiceCollection services) {
			services.AddSingleton<IChessHubService, ChessHubService>();
			return services;
		}
	}
}

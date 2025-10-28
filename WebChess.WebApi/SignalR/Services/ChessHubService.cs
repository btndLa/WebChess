using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;
using WebChess.WebApi.SignalR.Hubs;

namespace WebChess.WebApi.SignalR.Services {
	public class ChessHubService : IChessHubService {
		private readonly IHubContext<ChessHub> _hubContext;

		public ChessHubService(IHubContext<ChessHub> hubContext) {
			_hubContext = hubContext;
		}
	}
}
	
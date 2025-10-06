using Microsoft.AspNetCore.SignalR;
using WebChess.WebApi.SignalR.Hubs;

namespace WebChess.WebApi.SignalR.Services {
	public class ChessHubService : IChessHubService {
		private readonly IHubContext<ChessHub> _hubContext;

		public ChessHubService(IHubContext<ChessHub> hubContext) {
			_hubContext = hubContext;
		}

		public async Task JoinGame(string connectionId, string gameId) {
			await _hubContext.Groups.AddToGroupAsync(connectionId, gameId);
		}

		public async Task MakeMove(string connectionId, string gameId, string from, string to) {
			await _hubContext.Clients.GroupExcept(gameId, connectionId).SendAsync("ReceiveMove", from, to);

		}
	}
}

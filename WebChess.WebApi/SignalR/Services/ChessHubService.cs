using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;
using WebChess.WebApi.SignalR.Hubs;

namespace WebChess.WebApi.SignalR.Services {
	public class ChessHubService : IChessHubService {
		private readonly IHubContext<ChessHub> _hubContext;

		public ChessHubService(IHubContext<ChessHub> hubContext) {
			_hubContext = hubContext;
		}

		public async Task JoinGameAsync(string connectionId, string gameId) {
			await _hubContext.Groups.AddToGroupAsync(connectionId, gameId);
			await _hubContext.Clients.GroupExcept(gameId, connectionId).SendAsync("PlayerJoined", connectionId);
		}

		public async Task MakeMoveAsync(string connectionId, string gameId, string from, string to) {
			await _hubContext.Clients.GroupExcept(gameId, connectionId).SendAsync("ReceiveMove", from, to);
		}
	}
}

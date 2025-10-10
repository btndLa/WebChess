using Microsoft.AspNetCore.Connections.Features;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using WebChess.DataAccess.Services;
using WebChess.WebApi.SignalR.Services;

namespace WebChess.WebApi.SignalR.Hubs {
	public class ChessHub : Hub {
		private readonly IChessHubService _hubService;
		private readonly IGameService _gameService;

		public ChessHub(IChessHubService hubService, IGameService gameService) {
			_hubService = hubService;
			_gameService = gameService;
		}

		public async Task MakeMove(string gameId, string from, string to) {
			var (success, newFen, error) = await _gameService.ApplyMoveAsync(Guid.Parse(gameId), from, to);
			if (!success) {
				await Clients.Caller.SendAsync("MoveRejected", error);
				return;
			}

			// Broadcast the move and new FEN to all clients in the group except the sender
			await Clients.GroupExcept(gameId, Context.ConnectionId)
				.SendAsync("MoveReceived", from, to, newFen);
		}


		public async Task JoinGameGroup(string gameId)
		{
			await _hubService.JoinGameAsync(Context.ConnectionId, gameId);
		}
	}
}

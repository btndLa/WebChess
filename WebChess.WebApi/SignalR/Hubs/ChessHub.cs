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

			await Clients.GroupExcept(gameId, Context.ConnectionId)
				.SendAsync("MoveReceived", from, to, newFen);
		}


		public async Task JoinGameGroup(string gameId)
		{
			await _hubService.JoinGameAsync(Context.ConnectionId, gameId);
		}

		public async Task EndGame(string gameId) { //TODO namings
			await Clients.Group(gameId).SendAsync("GameOver");
			await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
		}
	}
}

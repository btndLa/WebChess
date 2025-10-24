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

		public async Task MakeMove(string gameId, string from, string to, string san, char? promotion) {
			var (success, newFen, error) = await _gameService.ApplyMoveAsync(Guid.Parse(gameId), from, to, san, promotion);
			if (!success) {
				await Clients.Caller.SendAsync("MoveRejected", error);
				return;
			}

			await Clients.GroupExcept(gameId, Context.ConnectionId)
				.SendAsync("MoveReceived", from, to, promotion, newFen); //TODO [2025-10-24T16:14:23.995Z] Error: A callback for the method 'movereceived' threw error 'Error: Invalid move: {"from":"e2","to":"e4","promotion":null}'.
		}


		public async Task JoinGameGroup(string gameId)
		{
			await _hubService.JoinGameAsync(Context.ConnectionId, gameId);
		}

		public async Task EndGame(string gameId, string winner) { //TODO namings
			await Clients.Group(gameId).SendAsync("GameOver", winner);
			await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
		}
	}
}

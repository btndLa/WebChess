using Microsoft.AspNetCore.Connections.Features;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using WebChess.DataAccess.Services;
using WebChess.WebApi.SignalR.Services;

namespace WebChess.WebApi.SignalR.Hubs {
	public class ChessHub : Hub {
		private readonly IChessHubService _hubService;
		private readonly IGameService _gameService;
		private static readonly ConcurrentDictionary<string, HashSet<string>> _groupMembers = new();

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
				.SendAsync("MoveReceived", from, to, promotion, newFen);
		}


		public async Task JoinGameGroup(string gameId) {
			await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
			_groupMembers.AddOrUpdate(
			   gameId,
			   new HashSet<string> { Context.ConnectionId },
			   (key, existingSet) => {
				   existingSet.Add(Context.ConnectionId);
				   return existingSet;
			   });
			await Clients.GroupExcept(gameId, Context.ConnectionId)
				.SendAsync("PlayerJoined");
		}

		public async Task EndGame(string gameId, string winner) {
			await Clients.Group(gameId).SendAsync("GameOver", winner);
			await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
		}
	}
}

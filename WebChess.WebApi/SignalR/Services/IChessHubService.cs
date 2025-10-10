namespace WebChess.WebApi.SignalR.Services {
	public interface IChessHubService {
		Task JoinGameAsync(string connectionId, string gameId);
		Task MakeMoveAsync(string connectionId, string gameId, string from, string to);
	}
}

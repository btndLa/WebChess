namespace WebChess.WebApi.SignalR.Services {
	public interface IChessHubService {
		Task JoinGameAsync(string connectionId, string gameId);
	}
}

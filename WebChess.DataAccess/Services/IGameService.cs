using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebChess.DataAccess.Models;

namespace WebChess.DataAccess.Services {
	public interface IGameService {
		Task<Game> CreateGameAsync(string userId);
		Task<Game?> JoinGameAsync(string userId, Guid gameId);
        Task<Game?> GetGame(Guid gameId);
	}
}

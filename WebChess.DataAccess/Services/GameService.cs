using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebChess.DataAccess.Models;

namespace WebChess.DataAccess.Services {
	public class GameService : IGameService
    {
        private readonly WebChessDbContext _context;

        public GameService(WebChessDbContext context)
        {
            _context = context;
        }

        public async Task<Game> CreateGameAsync(string userId)
        {
            var game = new Game
            {
                Fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                Status = "waiting",
                CreatedAt = DateTime.UtcNow,
                WhitePlayerId = userId
            };
            await _context.Games.AddAsync(game);
            await _context.SaveChangesAsync();
            return game;
        }

        public async Task<Game?> JoinGameAsync(string userId, Guid gameId)
        {
            var game = await _context.Games.FirstOrDefaultAsync(g => g.Id == gameId && g.Status == "waiting");
            if (game == null || game.WhitePlayerId == userId)
                return null;
            game.BlackPlayerId = userId;
            game.Status = "active";
            await _context.SaveChangesAsync();
            return game;
        }

        public async Task<Game?> GetGame(Guid gameId)
        {
            var game = await _context.Games
                .Where(g => g.Id == gameId)
                .Select(g => new Game
                {
                    Id = g.Id,
                    WhitePlayerId = g.WhitePlayerId,
                    BlackPlayerId = g.BlackPlayerId,
                    Fen = g.Fen
                })
                .FirstOrDefaultAsync();

            return game;
        }
    }
}

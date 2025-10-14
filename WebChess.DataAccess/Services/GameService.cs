using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebChess.DataAccess.Models;
using ChessDotNet;

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
            var random = new Random();
            bool isWhite = random.Next(2) == 0;

            var game = new Game
            {
                Fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                Status = "waiting",
                CreatedAt = DateTime.UtcNow,
                WhitePlayerId = isWhite ? userId : null,
                BlackPlayerId = isWhite ? null : userId
            };
            await _context.Games.AddAsync(game);
            await _context.SaveChangesAsync();
            return game;
        }

        public async Task<Game?> JoinGameAsync(string userId, Guid gameId)
        {
            var game = await _context.Games.FirstOrDefaultAsync(g => g.Id == gameId && g.Status == "waiting");
            if (game == null)
                return null;

            if (game.WhitePlayerId == userId || game.BlackPlayerId == userId)
                return null;

            if (game.WhitePlayerId == null && game.BlackPlayerId == null)
            {
                var random = new Random();
                if (random.Next(2) == 0)
                    game.WhitePlayerId = userId;
                else
                    game.BlackPlayerId = userId;
            }
            else if (game.WhitePlayerId == null)
            {
                game.WhitePlayerId = userId;
            }
            else if (game.BlackPlayerId == null)
            {
                game.BlackPlayerId = userId;
            }
            else
            {
                return null;
            }

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

        public async Task<(bool Success, string? NewFen, string? Error)> ApplyMoveAsync(Guid gameId, string from, string to)
        {
            var game = await _context.Games.FindAsync(gameId);
            if (game == null) return (false, null, "Game not found");

            var chessGame = new ChessGame(game.Fen);
            var move = new Move(from, to, chessGame.WhoseTurn);


            if (!chessGame.IsValidMove(move))
                return (false, null, "Invalid move");

            chessGame.MakeMove(move, true);
            game.Fen = chessGame.GetFen();
            await _context.SaveChangesAsync();

            return (true, game.Fen, null);
        }

		public async Task<Game?> EndGameAsync(string gameId) {
			var game = await _context.Games.FindAsync(new Guid(gameId));
			if (game == null) return null;
            game.Status = "ended";
			await _context.SaveChangesAsync();
			return game;
		}
	}
}

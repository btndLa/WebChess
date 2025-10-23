using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebChess.DataAccess.Models {
	public class Game {
		public Guid Id { get; set; } = Guid.NewGuid();
		public string Fen { get; set; } = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
		public string? WhitePlayerId { get; set; }
		public string? BlackPlayerId { get; set; }
		public string[]? MoveHistory { get; set; } = Array.Empty<string>();
		public char[] TakenPieces { get; set; } = Array.Empty<char>();
		public string Status { get; set; } = "active";
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	}
}

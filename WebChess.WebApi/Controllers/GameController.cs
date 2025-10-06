using Microsoft.AspNetCore.Mvc;
using WebChess.DataAccess.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;

namespace WebChess.WebApi.Controllers {
	[ApiController]
	[Route("/game")]
	public class GamesController : ControllerBase {
		private readonly IGameService _gameService;

		public GamesController(IGameService gameService) {
			_gameService = gameService;
		}

		[HttpPost("create")]
		[Authorize]
		public async Task<IActionResult> CreateGame() {
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null) return Unauthorized();
			var game = await _gameService.CreateGameAsync(userId);
			return Ok(new { gameId = game.Id, fen = game.Fen });
		}

		[HttpPost("join")]
		[Authorize]
		public async Task<IActionResult> JoinGame([FromBody] JoinGameRequest request) {
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null) return Unauthorized();
			if (!Guid.TryParse(request.GameId, out var gameGuid)) return BadRequest("Invalid game code");
			var game = await _gameService.JoinGameAsync(userId, gameGuid);
			if (game == null) return NotFound("Game not found or already started");
			return Ok(new { gameId = game.Id, fen = game.Fen });
		}
	}

	public class JoinGameRequest {
		public string GameId { get; set; } = string.Empty;
	}
}

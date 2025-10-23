using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using WebChess.DataAccess.Models;
using WebChess.DataAccess.Services;
using WebChess.Shared.Models;

namespace WebChess.WebApi.Controllers {
	[ApiController]
	[Route("/game")]
	public class GamesController : ControllerBase {
		private readonly IGameService _gameService;
		private readonly IMapper _mapper;

		public GamesController(IGameService gameService, IMapper mapper) {
			_gameService = gameService;
			_mapper = mapper;
		}

		[HttpPost("create")]
		[Authorize]
		public async Task<IActionResult> CreateGame() {
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null) return Unauthorized();
			var game = await _gameService.CreateGameAsync(userId);

			var gameDto = _mapper.Map<GameResponseDto>(game);
			gameDto.PlayerColor = game.WhitePlayerId == userId ? "w" : "b";
			
			return Ok(gameDto);
		}

		[HttpPost("join")]
		[Authorize]
		public async Task<IActionResult> JoinGame([FromBody] JoinGameRequest request) {
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null) return Unauthorized();
			if (!Guid.TryParse(request.GameId, out var gameGuid)) return BadRequest("Invalid game code");
			var game = await _gameService.JoinGameAsync(userId, gameGuid);
			if (game == null) return NotFound("Game not found or already started");

			var gameDto = _mapper.Map<GameResponseDto>(game);
			gameDto.PlayerColor = game.WhitePlayerId == userId ? "w" : "b";

			return Ok(gameDto);
		}

		[HttpGet("{id}")]
		[Authorize]
		public async Task<IActionResult> GetGame(Guid id) {
			var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (userId == null) return Unauthorized();

			var game = await _gameService.GetGame(id);
			if (game == null) return NotFound();

			if (game.WhitePlayerId != userId && game.BlackPlayerId != userId)
				return Forbid();

			var gameDto = _mapper.Map<GameResponseDto>(game);
			gameDto.PlayerColor = game.WhitePlayerId == userId ? "w" : "b";

			return Ok(gameDto);
		}

		[HttpPost("end")]
		[Authorize]
		public async Task<IActionResult> EndGame([FromBody] EndGameRequestDto request)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (userId == null) return Unauthorized();
			var game = await _gameService.EndGameAsync(request.GameId);
			if (game == null) return NotFound("Game not found");

			var gameDto = _mapper.Map<GameResponseDto>(game);
			gameDto.PlayerColor = game.WhitePlayerId == userId ? "w" : "b";
			
			return Ok(gameDto);
		}

		public class JoinGameRequest {
			public string GameId { get; set; } = string.Empty;
		}
	}
}

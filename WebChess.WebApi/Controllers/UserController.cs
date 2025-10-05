using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using WebChess.DataAccess.Models;
using WebChess.DataAccess.Services;
using WebChess.Shared.Models;

namespace WebChess.WebApi.Controllers {
	[ApiController]
	[Route("/users")]
	public class UserController : ControllerBase {
		private readonly IUserService _userService;
		private readonly IMapper _mapper;
		public UserController(IUserService userService, IMapper mapper) {
			_userService = userService;
			_mapper = mapper;
		}
		[HttpPost]
		[ProducesResponseType(statusCode: StatusCodes.Status201Created, type: typeof(UserResponseDto))]
		public async Task<IActionResult> CreateUser([FromBody] UserRequestDto userRequestDto) {
			var user = _mapper.Map<User>(userRequestDto);
			await _userService.AddUserAsync(user, userRequestDto.Password);
			var userResponse = _mapper.Map<UserResponseDto>(user);
			return StatusCode(StatusCodes.Status201Created, userResponse);

		}

		[HttpPost]
		[Route("login")]
		public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto) {
			var (authToken, refreshToken, userId) = await _userService.LoginAsync(loginRequestDto.UserName, loginRequestDto.Password);

			var loginResponseDto = new LoginResponseDto {
				UserId = userId,
				AuthToken = authToken,
				RefreshToken = refreshToken,
			};

			return Ok(loginResponseDto);
		}

		[HttpPost]
		[Route("logout")]
		[Authorize]
		public async Task<IActionResult> Logout() {
			await _userService.LogoutAsync();

			return NoContent();
		}

		[HttpPost]
		[Route("refresh")]
		public async Task<IActionResult> RedeemRefreshToken([FromBody] string refreshToken) {
			var (authToken, newRefreshToken, userId) = await _userService.RedeemRefreshTokenAsync(refreshToken);

			var loginResponseDto = new LoginResponseDto {
				UserId = userId,
				AuthToken = authToken,
				RefreshToken = newRefreshToken,
			};

			return Ok(loginResponseDto);
		}

		[HttpGet]
		[Route("{id}")]
		[Authorize]
		public async Task<IActionResult> GetUser([FromRoute][Required] string id) {
			var user = await _userService.GetUserByIdAsync(id);
			var userResponseDto = _mapper.Map<UserResponseDto>(user);

			return Ok(userResponseDto);
		}
	}
}

using Microsoft.AspNetCore.Mvc;

namespace WebChess.WebApi.Controllers {
	[ApiController]
	[Route("/users")]
	public class UserController : ControllerBase {
		private readonly IUserService _userService;
		public IActionResult Index() {
			return View();
		}
	}
}

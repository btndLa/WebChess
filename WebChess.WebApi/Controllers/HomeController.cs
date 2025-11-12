using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WebChess.WebApi.Models;

namespace WebChess.WebApi.Controllers {

	[ApiController]
	[Route("api/health")]
	public class HealthController : ControllerBase {
		[HttpGet]
		public IActionResult Get() {
			return Ok("OK");
		}
	}
	public class HomeController : Controller {
		private readonly ILogger<HomeController> _logger;

		public HomeController(ILogger<HomeController> logger) {
			_logger = logger;
		}

		public IActionResult Index() {
			return Ok();
		}
	}
}

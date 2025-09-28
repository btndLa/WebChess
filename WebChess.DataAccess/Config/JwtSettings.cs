using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebChess.DataAccess.Config {
	public class JwtSettings {
		public required string SecretKey { get; init; }
		public required string Audience { get; init; }
		public required string Issuer { get; init; }
		public required int AccessTokenExpirationMinutes { get; init; }
	}
}

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebChess.DataAccess.Models;

namespace WebChess.DataAccess;

	public class WebChessDbContext : IdentityDbContext<User, UserRole, string >  {
			
		public WebChessDbContext(DbContextOptions<WebChessDbContext> options) : base(options) { }
}




using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using WebChess.DataAccess.Models;

namespace WebChess.DataAccess;

	public class WebChessDbContext : IdentityDbContext<User, IdentityRole, string >  {
		public DbSet<Game> Games { get; set; } = null!;

	public WebChessDbContext(DbContextOptions<WebChessDbContext> options) : base(options) { }

	protected override void OnModelCreating(ModelBuilder modelBuilder) {
		base.OnModelCreating(modelBuilder);

		var stringArrayConverter = new ValueConverter<string[], string>(
			v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
			v => JsonSerializer.Deserialize<string[]>(v, (JsonSerializerOptions)null)
		);

		var stringArrayComparer = new ValueComparer<string[]>(
			(a, b) => a.SequenceEqual(b),
			a => a.Aggregate(0, (hash, value) => HashCode.Combine(hash, value == null ? 0 : value.GetHashCode())),
			a => a.ToArray()
		);

		var charArrayConverter = new ValueConverter<char[], string>(
			v => new string(v),
			v => v == null ? Array.Empty<char>() : v.ToCharArray()
		);

		var charArrayComparer = new ValueComparer<char[]>(
			(a, b) => a.SequenceEqual(b),
			a => a.Aggregate(0, (hash, value) => HashCode.Combine(hash, value.GetHashCode())),
			a => a.ToArray()
		);


		modelBuilder.Entity<Game>(entity =>
		{
			var moveHistoryProperty = entity.Property(g => g.MoveHistory)
				.HasConversion(stringArrayConverter)
				.HasColumnType("longtext");
			moveHistoryProperty.Metadata.SetValueComparer(stringArrayComparer);


			var takenPiecesProperty = entity.Property(g => g.TakenPieces)
				  .HasConversion(charArrayConverter)
				  .HasColumnType("longtext");
			takenPiecesProperty.Metadata.SetValueComparer(charArrayComparer);
		});
	}


}




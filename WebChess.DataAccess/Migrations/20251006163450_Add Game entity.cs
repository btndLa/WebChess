using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebChess.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddGameentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Fen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WhitePlayerId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BlackPlayerId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MoveHistory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Games");
        }
    }
}

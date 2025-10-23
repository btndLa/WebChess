using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebChess.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Playercolor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TakenPieces",
                table: "Games",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TakenPieces",
                table: "Games");
        }
    }
}

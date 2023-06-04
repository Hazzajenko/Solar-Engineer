using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSignalrEventMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Panels");

            migrationBuilder.RenameColumn(
                name: "Rotation",
                table: "Panels",
                newName: "Location_Y");

            migrationBuilder.AddColumn<int>(
                name: "Angle",
                table: "Panels",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Location_X",
                table: "Panels",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Angle",
                table: "Panels");

            migrationBuilder.DropColumn(
                name: "Location_X",
                table: "Panels");

            migrationBuilder.RenameColumn(
                name: "Location_Y",
                table: "Panels",
                newName: "Rotation");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Panels",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}

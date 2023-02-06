using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditNotificationsAddStringEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppUserReceivedToUserStatus",
                table: "AppUserLinks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AppUserRequestedToUserStatus",
                table: "AppUserLinks",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppUserReceivedToUserStatus",
                table: "AppUserLinks");

            migrationBuilder.DropColumn(
                name: "AppUserRequestedToUserStatus",
                table: "AppUserLinks");
        }
    }
}

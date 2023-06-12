using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditNotificationsOmitContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppUserUserName",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "Content",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "SenderAppUserUserName",
                table: "Notifications");

            migrationBuilder.AddColumn<bool>(
                name: "AppUserResponded",
                table: "Notifications",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppUserResponded",
                table: "Notifications");

            migrationBuilder.AddColumn<string>(
                name: "AppUserUserName",
                table: "Notifications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "Notifications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderAppUserUserName",
                table: "Notifications",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}

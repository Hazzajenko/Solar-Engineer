using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddReceivedByAppUserToNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ReceivedByAppUser",
                table: "Notifications",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReceivedByAppUser",
                table: "Notifications");
        }
    }
}

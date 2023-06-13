using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditNotificationAddCompleted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AppUserRespondedTime",
                table: "Notifications",
                newName: "CompletedTime");

            migrationBuilder.RenameColumn(
                name: "AppUserResponded",
                table: "Notifications",
                newName: "Completed");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CompletedTime",
                table: "Notifications",
                newName: "AppUserRespondedTime");

            migrationBuilder.RenameColumn(
                name: "Completed",
                table: "Notifications",
                newName: "AppUserResponded");
        }
    }
}

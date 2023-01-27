using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditUsernameToUserName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SenderUsername",
                table: "Messages",
                newName: "SenderUserName");

            migrationBuilder.RenameColumn(
                name: "RecipientUsername",
                table: "Messages",
                newName: "RecipientUserName");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Connection",
                newName: "UserName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SenderUserName",
                table: "Messages",
                newName: "SenderUsername");

            migrationBuilder.RenameColumn(
                name: "RecipientUserName",
                table: "Messages",
                newName: "RecipientUsername");

            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Connection",
                newName: "Username");
        }
    }
}

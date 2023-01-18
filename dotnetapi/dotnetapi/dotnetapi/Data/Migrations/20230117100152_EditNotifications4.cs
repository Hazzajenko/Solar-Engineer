using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditNotifications4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AppUserFriends_AppUserFriendRequestedById_App~",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_AppUserFriendRequestedById_AppUserFriendReque~",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "AppUserFriendId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "AppUserFriendRequestedById",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "AppUserFriendRequestedToId",
                table: "Notifications");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppUserFriendId",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AppUserFriendRequestedById",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AppUserFriendRequestedToId",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_AppUserFriendRequestedById_AppUserFriendReque~",
                table: "Notifications",
                columns: new[] { "AppUserFriendRequestedById", "AppUserFriendRequestedToId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AppUserFriends_AppUserFriendRequestedById_App~",
                table: "Notifications",
                columns: new[] { "AppUserFriendRequestedById", "AppUserFriendRequestedToId" },
                principalTable: "AppUserFriends",
                principalColumns: new[] { "RequestedById", "RequestedToId" });
        }
    }
}

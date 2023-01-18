using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditNotifications3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserFriends_Notifications_NotificationId",
                table: "AppUserFriends");

            migrationBuilder.DropIndex(
                name: "IX_AppUserFriends_NotificationId",
                table: "AppUserFriends");

            migrationBuilder.DropColumn(
                name: "NotificationId",
                table: "AppUserFriends");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AppUserFriends_AppUserFriendRequestedById_App~",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_AppUserFriendRequestedById_AppUserFriendReque~",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "AppUserFriendRequestedById",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "AppUserFriendRequestedToId",
                table: "Notifications");

            migrationBuilder.AddColumn<int>(
                name: "NotificationId",
                table: "AppUserFriends",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AppUserFriends_NotificationId",
                table: "AppUserFriends",
                column: "NotificationId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserFriends_Notifications_NotificationId",
                table: "AppUserFriends",
                column: "NotificationId",
                principalTable: "Notifications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

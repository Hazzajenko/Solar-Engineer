using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditNotification2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AppUserFriends_AppUserId_AppUserFriendId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_AppUserId_AppUserFriendId",
                table: "Notifications");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_AppUserId",
                table: "Notifications",
                column: "AppUserId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserFriends_Notifications_NotificationId",
                table: "AppUserFriends");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_AppUserId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_AppUserFriends_NotificationId",
                table: "AppUserFriends");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_AppUserId_AppUserFriendId",
                table: "Notifications",
                columns: new[] { "AppUserId", "AppUserFriendId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AppUserFriends_AppUserId_AppUserFriendId",
                table: "Notifications",
                columns: new[] { "AppUserId", "AppUserFriendId" },
                principalTable: "AppUserFriends",
                principalColumns: new[] { "RequestedById", "RequestedToId" });
        }
    }
}

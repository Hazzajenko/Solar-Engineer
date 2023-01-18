using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditAppUserFriend : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FriendRequestNotification_AspNetUsers_AppUserId",
                table: "FriendRequestNotification");

            migrationBuilder.DropForeignKey(
                name: "FK_FriendRequests_AspNetUsers_RequestedById",
                table: "FriendRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_FriendRequests_AspNetUsers_RequestedToId",
                table: "FriendRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_AppUserId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_FriendRequests_FriendRequestId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_FriendRequestNotification_AppUserId",
                table: "FriendRequestNotification");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Notifications",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_FriendRequestId",
                table: "Notifications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FriendRequests",
                table: "FriendRequests");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "FriendRequestNotification");

            migrationBuilder.DropColumn(
                name: "NotificationId",
                table: "FriendRequests");

            migrationBuilder.RenameTable(
                name: "Notifications",
                newName: "Notification");

            migrationBuilder.RenameTable(
                name: "FriendRequests",
                newName: "FriendRequest");

            migrationBuilder.RenameColumn(
                name: "TimeCreated",
                table: "FriendRequestNotification",
                newName: "RequestTime");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_AppUserId",
                table: "Notification",
                newName: "IX_Notification_AppUserId");

            migrationBuilder.RenameIndex(
                name: "IX_FriendRequests_RequestedToId",
                table: "FriendRequest",
                newName: "IX_FriendRequest_RequestedToId");

            migrationBuilder.RenameIndex(
                name: "IX_FriendRequests_RequestedById",
                table: "FriendRequest",
                newName: "IX_FriendRequest_RequestedById");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequestTime",
                table: "AppUserFriends",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "AppUserFriends",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "AppUserFriends",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "AppUserFriends",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Notification",
                table: "Notification",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FriendRequest",
                table: "FriendRequest",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_FriendRequestId",
                table: "Notification",
                column: "FriendRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_FriendRequest_AspNetUsers_RequestedById",
                table: "FriendRequest",
                column: "RequestedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FriendRequest_AspNetUsers_RequestedToId",
                table: "FriendRequest",
                column: "RequestedToId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_AspNetUsers_AppUserId",
                table: "Notification",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_FriendRequest_FriendRequestId",
                table: "Notification",
                column: "FriendRequestId",
                principalTable: "FriendRequest",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FriendRequest_AspNetUsers_RequestedById",
                table: "FriendRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_FriendRequest_AspNetUsers_RequestedToId",
                table: "FriendRequest");

            migrationBuilder.DropForeignKey(
                name: "FK_Notification_AspNetUsers_AppUserId",
                table: "Notification");

            migrationBuilder.DropForeignKey(
                name: "FK_Notification_FriendRequest_FriendRequestId",
                table: "Notification");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Notification",
                table: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_Notification_FriendRequestId",
                table: "Notification");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FriendRequest",
                table: "FriendRequest");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "AppUserFriends");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "AppUserFriends");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "AppUserFriends");

            migrationBuilder.RenameTable(
                name: "Notification",
                newName: "Notifications");

            migrationBuilder.RenameTable(
                name: "FriendRequest",
                newName: "FriendRequests");

            migrationBuilder.RenameColumn(
                name: "RequestTime",
                table: "FriendRequestNotification",
                newName: "TimeCreated");

            migrationBuilder.RenameIndex(
                name: "IX_Notification_AppUserId",
                table: "Notifications",
                newName: "IX_Notifications_AppUserId");

            migrationBuilder.RenameIndex(
                name: "IX_FriendRequest_RequestedToId",
                table: "FriendRequests",
                newName: "IX_FriendRequests_RequestedToId");

            migrationBuilder.RenameIndex(
                name: "IX_FriendRequest_RequestedById",
                table: "FriendRequests",
                newName: "IX_FriendRequests_RequestedById");

            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "FriendRequestNotification",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequestTime",
                table: "AppUserFriends",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<int>(
                name: "NotificationId",
                table: "FriendRequests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Notifications",
                table: "Notifications",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FriendRequests",
                table: "FriendRequests",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequestNotification_AppUserId",
                table: "FriendRequestNotification",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_FriendRequestId",
                table: "Notifications",
                column: "FriendRequestId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FriendRequestNotification_AspNetUsers_AppUserId",
                table: "FriendRequestNotification",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FriendRequests_AspNetUsers_RequestedById",
                table: "FriendRequests",
                column: "RequestedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FriendRequests_AspNetUsers_RequestedToId",
                table: "FriendRequests",
                column: "RequestedToId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_AppUserId",
                table: "Notifications",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_FriendRequests_FriendRequestId",
                table: "Notifications",
                column: "FriendRequestId",
                principalTable: "FriendRequests",
                principalColumn: "Id");
        }
    }
}

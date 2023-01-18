using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_FriendRequests_Id",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_AppUserId",
                table: "Notifications");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Notifications",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "AppUserFriendId",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NotificationId",
                table: "AppUserFriends",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "FriendRequestNotification",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RequestedById = table.Column<int>(type: "integer", nullable: false),
                    RequestedToId = table.Column<int>(type: "integer", nullable: false),
                    BecameFriendsTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FriendRequestFlag = table.Column<int>(type: "integer", nullable: false),
                    AppUserId = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    TimeCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FriendRequestNotification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FriendRequestNotification_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FriendRequestNotification_AspNetUsers_RequestedById",
                        column: x => x.RequestedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FriendRequestNotification_AspNetUsers_RequestedToId",
                        column: x => x.RequestedToId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_AppUserId_AppUserFriendId",
                table: "Notifications",
                columns: new[] { "AppUserId", "AppUserFriendId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_FriendRequestId",
                table: "Notifications",
                column: "FriendRequestId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequestNotification_AppUserId",
                table: "FriendRequestNotification",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequestNotification_RequestedById",
                table: "FriendRequestNotification",
                column: "RequestedById");

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequestNotification_RequestedToId",
                table: "FriendRequestNotification",
                column: "RequestedToId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AppUserFriends_AppUserId_AppUserFriendId",
                table: "Notifications",
                columns: new[] { "AppUserId", "AppUserFriendId" },
                principalTable: "AppUserFriends",
                principalColumns: new[] { "RequestedById", "RequestedToId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_FriendRequests_FriendRequestId",
                table: "Notifications",
                column: "FriendRequestId",
                principalTable: "FriendRequests",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AppUserFriends_AppUserId_AppUserFriendId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_FriendRequests_FriendRequestId",
                table: "Notifications");

            migrationBuilder.DropTable(
                name: "FriendRequestNotification");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_AppUserId_AppUserFriendId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_FriendRequestId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "AppUserFriendId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "NotificationId",
                table: "AppUserFriends");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Notifications",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_AppUserId",
                table: "Notifications",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_FriendRequests_Id",
                table: "Notifications",
                column: "Id",
                principalTable: "FriendRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

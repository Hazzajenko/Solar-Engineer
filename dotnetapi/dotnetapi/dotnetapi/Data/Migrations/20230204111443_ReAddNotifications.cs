using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class ReAddNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUserFriends");

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppUserId = table.Column<int>(type: "integer", nullable: false),
                    AppUserUserName = table.Column<string>(type: "text", nullable: false),
                    NotificationFromId = table.Column<int>(type: "integer", nullable: false),
                    NotificationFromUserName = table.Column<string>(type: "text", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SeenByAppUser = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedByAppUser = table.Column<bool>(type: "boolean", nullable: false),
                    CancelledBySender = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_NotificationFromId",
                        column: x => x.NotificationFromId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_AppUserId",
                table: "Notifications",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_NotificationFromId",
                table: "Notifications",
                column: "NotificationFromId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.CreateTable(
                name: "AppUserFriends",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RequestedById = table.Column<int>(type: "integer", nullable: false),
                    RequestedToId = table.Column<int>(type: "integer", nullable: false),
                    BecameFriendsTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FriendRequestFlag = table.Column<int>(type: "integer", nullable: false),
                    RequestTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserFriends", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppUserFriends_AspNetUsers_RequestedById",
                        column: x => x.RequestedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppUserFriends_AspNetUsers_RequestedToId",
                        column: x => x.RequestedToId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUserFriends_RequestedById",
                table: "AppUserFriends",
                column: "RequestedById");

            migrationBuilder.CreateIndex(
                name: "IX_AppUserFriends_RequestedToId",
                table: "AppUserFriends",
                column: "RequestedToId");
        }
    }
}

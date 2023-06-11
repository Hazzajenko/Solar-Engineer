using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    AppUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    AppUserUserName = table.Column<string>(type: "text", nullable: false),
                    SenderAppUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SenderAppUserUserName = table.Column<string>(type: "text", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    NotificationType = table.Column<string>(type: "text", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
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
                        name: "FK_Notifications_AspNetUsers_SenderAppUserId",
                        column: x => x.SenderAppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_AppUserId",
                table: "Notifications",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_SenderAppUserId",
                table: "Notifications",
                column: "SenderAppUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notifications");
        }
    }
}

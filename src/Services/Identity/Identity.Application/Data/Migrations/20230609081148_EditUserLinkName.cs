using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditUserLinkName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserLinks");

            migrationBuilder.CreateTable(
                name: "AppUserLinks",
                columns: table => new
                {
                    AppUserRequestedId = table.Column<Guid>(type: "uuid", nullable: false),
                    AppUserReceivedId = table.Column<Guid>(type: "uuid", nullable: false),
                    AppUserRequestedDisplayName = table.Column<string>(type: "text", nullable: false),
                    AppUserReceivedDisplayName = table.Column<string>(type: "text", nullable: false),
                    BecameFriendsTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Friends = table.Column<bool>(type: "boolean", nullable: false),
                    AppUserRequestedStatusEvent = table.Column<string>(type: "text", nullable: false),
                    AppUserRequestedStatusTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AppUserReceivedStatusEvent = table.Column<string>(type: "text", nullable: false),
                    AppUserReceivedStatusTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserLinks", x => new { x.AppUserRequestedId, x.AppUserReceivedId });
                    table.ForeignKey(
                        name: "FK_AppUserLinks_AspNetUsers_AppUserReceivedId",
                        column: x => x.AppUserReceivedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppUserLinks_AspNetUsers_AppUserRequestedId",
                        column: x => x.AppUserRequestedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUserLinks_AppUserReceivedId",
                table: "AppUserLinks",
                column: "AppUserReceivedId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUserLinks");

            migrationBuilder.CreateTable(
                name: "UserLinks",
                columns: table => new
                {
                    AppUserRequestedId = table.Column<Guid>(type: "uuid", nullable: false),
                    AppUserReceivedId = table.Column<Guid>(type: "uuid", nullable: false),
                    AppUserReceivedDisplayName = table.Column<string>(type: "text", nullable: false),
                    AppUserReceivedStatusEvent = table.Column<string>(type: "text", nullable: false),
                    AppUserReceivedStatusTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AppUserRequestedDisplayName = table.Column<string>(type: "text", nullable: false),
                    AppUserRequestedStatusEvent = table.Column<string>(type: "text", nullable: false),
                    AppUserRequestedStatusTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    BecameFriendsTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Friends = table.Column<bool>(type: "boolean", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLinks", x => new { x.AppUserRequestedId, x.AppUserReceivedId });
                    table.ForeignKey(
                        name: "FK_UserLinks_AspNetUsers_AppUserReceivedId",
                        column: x => x.AppUserReceivedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserLinks_AspNetUsers_AppUserRequestedId",
                        column: x => x.AppUserRequestedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserLinks_AppUserReceivedId",
                table: "UserLinks",
                column: "AppUserReceivedId");
        }
    }
}

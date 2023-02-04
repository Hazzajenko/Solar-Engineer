using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAppUserLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUserLinks",
                columns: table => new
                {
                    AppUserRequestedId = table.Column<int>(type: "integer", nullable: false),
                    AppUserReceivedId = table.Column<int>(type: "integer", nullable: false),
                    AppUserRequestedUserName = table.Column<string>(type: "text", nullable: false),
                    AppUserRequestedNickName = table.Column<string>(type: "text", nullable: false),
                    AppUserReceivedUserName = table.Column<string>(type: "text", nullable: false),
                    AppUserReceivedNickName = table.Column<string>(type: "text", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    BecameFriendsTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Friends = table.Column<bool>(type: "boolean", nullable: false),
                    UserToUserStatus = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
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
        }
    }
}

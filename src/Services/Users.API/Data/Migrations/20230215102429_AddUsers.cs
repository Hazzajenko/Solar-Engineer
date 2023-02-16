using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Users.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserLinks",
                table: "UserLinks");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "UserLinks",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid ()");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserLinks",
                table: "UserLinks",
                columns: new[] { "AppUserRequestedId", "AppUserReceivedId" });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    DisplayName = table.Column<string>(type: "text", nullable: false),
                    PhotoUrl = table.Column<string>(type: "text", nullable: false),
                    LastActiveTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserLinks_AppUserReceivedId",
                table: "UserLinks",
                column: "AppUserReceivedId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserLinks_Users_AppUserReceivedId",
                table: "UserLinks",
                column: "AppUserReceivedId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserLinks_Users_AppUserRequestedId",
                table: "UserLinks",
                column: "AppUserRequestedId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserLinks_Users_AppUserReceivedId",
                table: "UserLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_UserLinks_Users_AppUserRequestedId",
                table: "UserLinks");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserLinks",
                table: "UserLinks");

            migrationBuilder.DropIndex(
                name: "IX_UserLinks_AppUserReceivedId",
                table: "UserLinks");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "UserLinks",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid ()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserLinks",
                table: "UserLinks",
                column: "Id");
        }
    }
}

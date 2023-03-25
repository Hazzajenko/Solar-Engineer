using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "AppUserProjects");

            migrationBuilder.RenameColumn(
                name: "AppUserId",
                table: "AppUserProjects",
                newName: "ProjectUserId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModifiedTime",
                table: "AppUserProjects",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "now()",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedTime",
                table: "AppUserProjects",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "now()",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.CreateTable(
                name: "ProjectUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserName = table.Column<string>(type: "text", nullable: false),
                    DisplayName = table.Column<string>(type: "text", nullable: false),
                    PhotoUrl = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectUsers", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserProjects_ProjectUsers_ProjectUserId",
                table: "AppUserProjects",
                column: "ProjectUserId",
                principalTable: "ProjectUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserProjects_ProjectUsers_ProjectUserId",
                table: "AppUserProjects");

            migrationBuilder.DropTable(
                name: "ProjectUsers");

            migrationBuilder.RenameColumn(
                name: "ProjectUserId",
                table: "AppUserProjects",
                newName: "AppUserId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModifiedTime",
                table: "AppUserProjects",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "now()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedTime",
                table: "AppUserProjects",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "now()");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "AppUserProjects",
                type: "uuid",
                nullable: false,
                defaultValueSql: "uuid_generate_v4()");
        }
    }
}

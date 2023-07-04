using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectUsersAgain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SelectedProjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectUsers", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserProjects_ProjectUsers_AppUserId",
                table: "AppUserProjects",
                column: "AppUserId",
                principalTable: "ProjectUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserProjects_ProjectUsers_AppUserId",
                table: "AppUserProjects");

            migrationBuilder.DropTable(
                name: "ProjectUsers");
        }
    }
}

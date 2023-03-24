using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProjectsOnDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserProjects_Projects_ProjectId",
                table: "AppUserProjects");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserProjects_Projects_ProjectId",
                table: "AppUserProjects",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserProjects_Projects_ProjectId",
                table: "AppUserProjects");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserProjects_Projects_ProjectId",
                table: "AppUserProjects",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");
        }
    }
}

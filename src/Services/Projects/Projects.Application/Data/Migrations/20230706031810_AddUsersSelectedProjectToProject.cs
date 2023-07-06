using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUsersSelectedProjectToProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ProjectUsers_SelectedProjectId",
                table: "ProjectUsers",
                column: "SelectedProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectUsers_Projects_SelectedProjectId",
                table: "ProjectUsers",
                column: "SelectedProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectUsers_Projects_SelectedProjectId",
                table: "ProjectUsers");

            migrationBuilder.DropIndex(
                name: "IX_ProjectUsers_SelectedProjectId",
                table: "ProjectUsers");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByToGroupChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedById",
                table: "GroupChats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CreatedByUserName",
                table: "GroupChats",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_GroupChats_CreatedById",
                table: "GroupChats",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChats_AspNetUsers_CreatedById",
                table: "GroupChats",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChats_AspNetUsers_CreatedById",
                table: "GroupChats");

            migrationBuilder.DropIndex(
                name: "IX_GroupChats_CreatedById",
                table: "GroupChats");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "GroupChats");

            migrationBuilder.DropColumn(
                name: "CreatedByUserName",
                table: "GroupChats");
        }
    }
}

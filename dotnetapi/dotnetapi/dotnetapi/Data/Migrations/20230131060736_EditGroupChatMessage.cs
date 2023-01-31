using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditGroupChatMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatMessages_AspNetUsers_SenderId",
                table: "GroupChatMessages");

            migrationBuilder.AddColumn<bool>(
                name: "SenderInGroup",
                table: "GroupChatMessages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatMessages_AspNetUsers_SenderId",
                table: "GroupChatMessages",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatMessages_AspNetUsers_SenderId",
                table: "GroupChatMessages");

            migrationBuilder.DropColumn(
                name: "SenderInGroup",
                table: "GroupChatMessages");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatMessages_AspNetUsers_SenderId",
                table: "GroupChatMessages",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

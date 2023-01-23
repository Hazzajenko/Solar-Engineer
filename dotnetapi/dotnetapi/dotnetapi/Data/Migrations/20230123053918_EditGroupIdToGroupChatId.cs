using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditGroupIdToGroupChatId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatMessages_GroupChats_GroupId",
                table: "GroupChatMessages");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "GroupChatMessages",
                newName: "GroupChatId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupChatMessages_GroupId",
                table: "GroupChatMessages",
                newName: "IX_GroupChatMessages_GroupChatId");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatMessages_GroupChats_GroupChatId",
                table: "GroupChatMessages",
                column: "GroupChatId",
                principalTable: "GroupChats",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatMessages_GroupChats_GroupChatId",
                table: "GroupChatMessages");

            migrationBuilder.RenameColumn(
                name: "GroupChatId",
                table: "GroupChatMessages",
                newName: "GroupId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupChatMessages_GroupChatId",
                table: "GroupChatMessages",
                newName: "IX_GroupChatMessages_GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatMessages_GroupChats_GroupId",
                table: "GroupChatMessages",
                column: "GroupId",
                principalTable: "GroupChats",
                principalColumn: "Id");
        }
    }
}

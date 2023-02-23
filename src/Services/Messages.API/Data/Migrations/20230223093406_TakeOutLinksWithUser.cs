using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messages.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class TakeOutLinksWithUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatMessages_Users_SenderId",
                table: "GroupChatMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatReadTime_Users_UserId",
                table: "GroupChatReadTime");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_RecipientId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_UserGroupChats_Users_UserId",
                table: "UserGroupChats");

            migrationBuilder.DropIndex(
                name: "IX_UserGroupChats_UserId",
                table: "UserGroupChats");

            migrationBuilder.DropIndex(
                name: "IX_Messages_RecipientId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_SenderId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_GroupChatReadTime_UserId",
                table: "GroupChatReadTime");

            migrationBuilder.DropIndex(
                name: "IX_GroupChatMessages_SenderId",
                table: "GroupChatMessages");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_UserGroupChats_UserId",
                table: "UserGroupChats",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_RecipientId",
                table: "Messages",
                column: "RecipientId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_SenderId",
                table: "Messages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupChatReadTime_UserId",
                table: "GroupChatReadTime",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupChatMessages_SenderId",
                table: "GroupChatMessages",
                column: "SenderId");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatMessages_Users_SenderId",
                table: "GroupChatMessages",
                column: "SenderId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatReadTime_Users_UserId",
                table: "GroupChatReadTime",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_RecipientId",
                table: "Messages",
                column: "RecipientId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages",
                column: "SenderId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserGroupChats_Users_UserId",
                table: "UserGroupChats",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

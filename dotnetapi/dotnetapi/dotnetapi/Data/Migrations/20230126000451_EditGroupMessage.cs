using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditGroupMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatReadTime_AspNetUsers_AppUserId",
                table: "GroupChatReadTime");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatReadTime_GroupChatMessages_GroupChatMessageId",
                table: "GroupChatReadTime");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupChatReadTime",
                table: "GroupChatReadTime");

            migrationBuilder.RenameTable(
                name: "GroupChatReadTime",
                newName: "GroupChatReadTimes");

            migrationBuilder.RenameIndex(
                name: "IX_GroupChatReadTime_GroupChatMessageId",
                table: "GroupChatReadTimes",
                newName: "IX_GroupChatReadTimes_GroupChatMessageId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupChatReadTime_AppUserId",
                table: "GroupChatReadTimes",
                newName: "IX_GroupChatReadTimes_AppUserId");

            migrationBuilder.AlterColumn<int>(
                name: "GroupChatMessageId",
                table: "GroupChatReadTimes",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupChatReadTimes",
                table: "GroupChatReadTimes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatReadTimes_AspNetUsers_AppUserId",
                table: "GroupChatReadTimes",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatReadTimes_GroupChatMessages_GroupChatMessageId",
                table: "GroupChatReadTimes",
                column: "GroupChatMessageId",
                principalTable: "GroupChatMessages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatReadTimes_AspNetUsers_AppUserId",
                table: "GroupChatReadTimes");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatReadTimes_GroupChatMessages_GroupChatMessageId",
                table: "GroupChatReadTimes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupChatReadTimes",
                table: "GroupChatReadTimes");

            migrationBuilder.RenameTable(
                name: "GroupChatReadTimes",
                newName: "GroupChatReadTime");

            migrationBuilder.RenameIndex(
                name: "IX_GroupChatReadTimes_GroupChatMessageId",
                table: "GroupChatReadTime",
                newName: "IX_GroupChatReadTime_GroupChatMessageId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupChatReadTimes_AppUserId",
                table: "GroupChatReadTime",
                newName: "IX_GroupChatReadTime_AppUserId");

            migrationBuilder.AlterColumn<int>(
                name: "GroupChatMessageId",
                table: "GroupChatReadTime",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupChatReadTime",
                table: "GroupChatReadTime",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatReadTime_AspNetUsers_AppUserId",
                table: "GroupChatReadTime",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatReadTime_GroupChatMessages_GroupChatMessageId",
                table: "GroupChatReadTime",
                column: "GroupChatMessageId",
                principalTable: "GroupChatMessages",
                principalColumn: "Id");
        }
    }
}

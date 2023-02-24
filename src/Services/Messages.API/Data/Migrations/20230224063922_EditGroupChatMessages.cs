using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messages.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditGroupChatMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GroupChatServerMessages");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "UserGroupChats",
                newName: "AppUserId");

            migrationBuilder.AddColumn<bool>(
                name: "ServerMessage",
                table: "GroupChatMessages",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServerMessage",
                table: "GroupChatMessages");

            migrationBuilder.RenameColumn(
                name: "AppUserId",
                table: "UserGroupChats",
                newName: "UserId");

            migrationBuilder.CreateTable(
                name: "GroupChatServerMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupChatId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MessageSentTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupChatServerMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupChatServerMessages_GroupChats_GroupChatId",
                        column: x => x.GroupChatId,
                        principalTable: "GroupChats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupChatServerMessages_GroupChatId",
                table: "GroupChatServerMessages",
                column: "GroupChatId");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Messages.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GroupChats",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uuid", nullable: false),
                    Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PhotoUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupChats", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SenderId = table.Column<Guid>(type: "uuid", nullable: false),
                    RecipientId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    MessageReadTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    MessageSentTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SenderDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    RecipientDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppUserGroupChats",
                columns: table => new
                {
                    AppUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupChatId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    CanInvite = table.Column<bool>(type: "boolean", nullable: false),
                    CanKick = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserGroupChats", x => new { x.AppUserId, x.GroupChatId });
                    table.ForeignKey(
                        name: "FK_AppUserGroupChats_GroupChats_GroupChatId",
                        column: x => x.GroupChatId,
                        principalTable: "GroupChats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GroupChatMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SenderId = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupChatId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    MessageSentTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SenderInGroup = table.Column<bool>(type: "boolean", nullable: false),
                    SenderDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    ServerMessage = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupChatMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupChatMessages_GroupChats_GroupChatId",
                        column: x => x.GroupChatId,
                        principalTable: "GroupChats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GroupChatReadTimes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupChatMessageId = table.Column<Guid>(type: "uuid", nullable: false),
                    MessageReadTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupChatReadTimes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupChatReadTimes_GroupChatMessages_GroupChatMessageId",
                        column: x => x.GroupChatMessageId,
                        principalTable: "GroupChatMessages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUserGroupChats_GroupChatId",
                table: "AppUserGroupChats",
                column: "GroupChatId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupChatMessages_GroupChatId",
                table: "GroupChatMessages",
                column: "GroupChatId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupChatReadTimes_GroupChatMessageId",
                table: "GroupChatReadTimes",
                column: "GroupChatMessageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUserGroupChats");

            migrationBuilder.DropTable(
                name: "GroupChatReadTimes");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "GroupChatMessages");

            migrationBuilder.DropTable(
                name: "GroupChats");
        }
    }
}

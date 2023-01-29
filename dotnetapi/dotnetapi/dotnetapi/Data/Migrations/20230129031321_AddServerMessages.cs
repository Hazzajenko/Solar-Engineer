using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddServerMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatMessages_AspNetUsers_SenderId",
                table: "GroupChatMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatMessages_GroupChats_GroupChatId",
                table: "GroupChatMessages");

            migrationBuilder.CreateTable(
                name: "GroupChatServerMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GroupChatId = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
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

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatMessages_AspNetUsers_SenderId",
                table: "GroupChatMessages",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatMessages_GroupChats_GroupChatId",
                table: "GroupChatMessages",
                column: "GroupChatId",
                principalTable: "GroupChats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatMessages_AspNetUsers_SenderId",
                table: "GroupChatMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupChatMessages_GroupChats_GroupChatId",
                table: "GroupChatMessages");

            migrationBuilder.DropTable(
                name: "GroupChatServerMessages");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatMessages_AspNetUsers_SenderId",
                table: "GroupChatMessages",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupChatMessages_GroupChats_GroupChatId",
                table: "GroupChatMessages",
                column: "GroupChatId",
                principalTable: "GroupChats",
                principalColumn: "Id");
        }
    }
}

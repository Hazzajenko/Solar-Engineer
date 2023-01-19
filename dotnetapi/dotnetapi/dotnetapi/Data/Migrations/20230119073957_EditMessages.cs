using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FriendRequestNotification");

            migrationBuilder.RenameColumn(
                name: "MessageSent",
                table: "Messages",
                newName: "MessageSentTime");

            migrationBuilder.RenameColumn(
                name: "DateRead",
                table: "Messages",
                newName: "MessageReadTime");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Messages",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "MessageSentTime",
                table: "Messages",
                newName: "MessageSent");

            migrationBuilder.RenameColumn(
                name: "MessageReadTime",
                table: "Messages",
                newName: "DateRead");

            migrationBuilder.CreateTable(
                name: "FriendRequestNotification",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RequestedById = table.Column<int>(type: "integer", nullable: false),
                    RequestedToId = table.Column<int>(type: "integer", nullable: false),
                    BecameFriendsTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FriendRequestFlag = table.Column<int>(type: "integer", nullable: false),
                    RequestTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FriendRequestNotification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FriendRequestNotification_AspNetUsers_RequestedById",
                        column: x => x.RequestedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FriendRequestNotification_AspNetUsers_RequestedToId",
                        column: x => x.RequestedToId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequestNotification_RequestedById",
                table: "FriendRequestNotification",
                column: "RequestedById");

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequestNotification_RequestedToId",
                table: "FriendRequestNotification",
                column: "RequestedToId");
        }
    }
}

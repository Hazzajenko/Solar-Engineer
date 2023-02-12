using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Users.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserLinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid ()"),
                    AppUserRequestedId = table.Column<Guid>(type: "uuid", nullable: false),
                    AppUserRequestedDisplayName = table.Column<string>(type: "text", nullable: false),
                    AppUserRequestedNickName = table.Column<string>(type: "text", nullable: false),
                    AppUserReceivedId = table.Column<Guid>(type: "uuid", nullable: false),
                    AppUserReceivedDisplayName = table.Column<string>(type: "text", nullable: false),
                    AppUserReceivedNickName = table.Column<string>(type: "text", nullable: false),
                    BecameFriendsTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Friends = table.Column<bool>(type: "boolean", nullable: false),
                    AppUserRequestedStatusEvent = table.Column<string>(type: "text", nullable: false),
                    AppUserRequestedStatusTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AppUserReceivedStatusEvent = table.Column<string>(type: "text", nullable: false),
                    AppUserReceivedStatusTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLinks", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserLinks");
        }
    }
}

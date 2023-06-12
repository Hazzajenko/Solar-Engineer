using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNotificationAddResponseTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AppUserRespondedTime",
                table: "Notifications",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SeenByAppUserTime",
                table: "Notifications",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppUserRespondedTime",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "SeenByAppUserTime",
                table: "Notifications");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditNotificationsAddStatusDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AppUserRequestedToUserStatus",
                table: "AppUserLinks",
                newName: "AppUserRequestedStatusEvent");

            migrationBuilder.RenameColumn(
                name: "AppUserReceivedToUserStatus",
                table: "AppUserLinks",
                newName: "AppUserReceivedStatusEvent");

            migrationBuilder.AddColumn<DateTime>(
                name: "AppUserReceivedStatusDate",
                table: "AppUserLinks",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "AppUserRequestedStatusDate",
                table: "AppUserLinks",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppUserReceivedStatusDate",
                table: "AppUserLinks");

            migrationBuilder.DropColumn(
                name: "AppUserRequestedStatusDate",
                table: "AppUserLinks");

            migrationBuilder.RenameColumn(
                name: "AppUserRequestedStatusEvent",
                table: "AppUserLinks",
                newName: "AppUserRequestedToUserStatus");

            migrationBuilder.RenameColumn(
                name: "AppUserReceivedStatusEvent",
                table: "AppUserLinks",
                newName: "AppUserReceivedToUserStatus");
        }
    }
}

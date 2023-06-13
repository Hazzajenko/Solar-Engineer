using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditAppUserLinkFriendRequestStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppUserReceivedDisplayName",
                table: "AppUserLinks");

            migrationBuilder.DropColumn(
                name: "AppUserReceivedStatusEvent",
                table: "AppUserLinks");

            migrationBuilder.DropColumn(
                name: "AppUserReceivedStatusTime",
                table: "AppUserLinks");

            migrationBuilder.RenameColumn(
                name: "AppUserRequestedStatusTime",
                table: "AppUserLinks",
                newName: "LastFriendRequestStatusChangeTime");

            migrationBuilder.RenameColumn(
                name: "AppUserRequestedStatusEvent",
                table: "AppUserLinks",
                newName: "AppUserRequestedFriendRequestStatus");

            migrationBuilder.RenameColumn(
                name: "AppUserRequestedDisplayName",
                table: "AppUserLinks",
                newName: "AppUserReceivedFriendRequestStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastFriendRequestStatusChangeTime",
                table: "AppUserLinks",
                newName: "AppUserRequestedStatusTime");

            migrationBuilder.RenameColumn(
                name: "AppUserRequestedFriendRequestStatus",
                table: "AppUserLinks",
                newName: "AppUserRequestedStatusEvent");

            migrationBuilder.RenameColumn(
                name: "AppUserReceivedFriendRequestStatus",
                table: "AppUserLinks",
                newName: "AppUserRequestedDisplayName");

            migrationBuilder.AddColumn<string>(
                name: "AppUserReceivedDisplayName",
                table: "AppUserLinks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AppUserReceivedStatusEvent",
                table: "AppUserLinks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "AppUserReceivedStatusTime",
                table: "AppUserLinks",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}

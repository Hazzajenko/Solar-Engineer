﻿using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditFriend : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserFriends_AspNetUsers_RequestedById",
                table: "AppUserFriends");

            migrationBuilder.DropForeignKey(
                name: "FK_AppUserFriends_AspNetUsers_RequestedToId",
                table: "AppUserFriends");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppUserFriends",
                table: "AppUserFriends");

            migrationBuilder.DropIndex(
                name: "IX_AppUserFriends_RequestedById",
                table: "AppUserFriends");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "AppUserFriends",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppUserFriends",
                table: "AppUserFriends",
                columns: new[] { "RequestedById", "RequestedToId" });

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserFriends_AspNetUsers_RequestedById",
                table: "AppUserFriends",
                column: "RequestedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserFriends_AspNetUsers_RequestedToId",
                table: "AppUserFriends",
                column: "RequestedToId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserFriends_AspNetUsers_RequestedById",
                table: "AppUserFriends");

            migrationBuilder.DropForeignKey(
                name: "FK_AppUserFriends_AspNetUsers_RequestedToId",
                table: "AppUserFriends");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppUserFriends",
                table: "AppUserFriends");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "AppUserFriends",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppUserFriends",
                table: "AppUserFriends",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_AppUserFriends_RequestedById",
                table: "AppUserFriends",
                column: "RequestedById");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserFriends_AspNetUsers_RequestedById",
                table: "AppUserFriends",
                column: "RequestedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserFriends_AspNetUsers_RequestedToId",
                table: "AppUserFriends",
                column: "RequestedToId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}

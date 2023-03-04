using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWithCreatedById : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "Strings",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "Panels",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "PanelLinks",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "PanelConfigs",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Strings");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Panels");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "PanelLinks");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "PanelConfigs");
        }
    }
}

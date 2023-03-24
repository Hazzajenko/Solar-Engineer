using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateConfigs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PanelLinks_Strings_StringId",
                table: "PanelLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_Panels_PanelConfigs_PanelConfigId",
                table: "Panels");

            migrationBuilder.DropForeignKey(
                name: "FK_Panels_Strings_StringId",
                table: "Panels");

            migrationBuilder.DropIndex(
                name: "IX_PanelLinks_StringId",
                table: "PanelLinks");

            migrationBuilder.DropColumn(
                name: "StringId",
                table: "PanelLinks");

            migrationBuilder.AddColumn<bool>(
                name: "Default",
                table: "PanelConfigs",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_Panels_PanelConfigs_PanelConfigId",
                table: "Panels",
                column: "PanelConfigId",
                principalTable: "PanelConfigs",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Panels_Strings_StringId",
                table: "Panels",
                column: "StringId",
                principalTable: "Strings",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Panels_PanelConfigs_PanelConfigId",
                table: "Panels");

            migrationBuilder.DropForeignKey(
                name: "FK_Panels_Strings_StringId",
                table: "Panels");

            migrationBuilder.DropColumn(
                name: "Default",
                table: "PanelConfigs");

            migrationBuilder.AddColumn<Guid>(
                name: "StringId",
                table: "PanelLinks",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_StringId",
                table: "PanelLinks",
                column: "StringId");

            migrationBuilder.AddForeignKey(
                name: "FK_PanelLinks_Strings_StringId",
                table: "PanelLinks",
                column: "StringId",
                principalTable: "Strings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Panels_PanelConfigs_PanelConfigId",
                table: "Panels",
                column: "PanelConfigId",
                principalTable: "PanelConfigs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Panels_Strings_StringId",
                table: "Panels",
                column: "StringId",
                principalTable: "Strings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PanelLinks_Panels_NegativeToId",
                table: "PanelLinks"
            );

            migrationBuilder.DropForeignKey(
                name: "FK_PanelLinks_Panels_PositiveToId",
                table: "PanelLinks"
            );

            /*migrationBuilder.DropPrimaryKey(
                name: "PK_Strings",
                table: "Strings"
                );*/

            migrationBuilder.Sql($"ALTER TABLE \"Strings\" DROP CONSTRAINT \"PK_Strings\" cascade");

            migrationBuilder.DropPrimaryKey(name: "PK_Panels", table: "Panels");

            migrationBuilder.DropIndex(name: "IX_PanelLinks_NegativeToId", table: "PanelLinks");

            migrationBuilder.DropIndex(name: "IX_PanelLinks_PositiveToId", table: "PanelLinks");

            migrationBuilder.DropPrimaryKey(name: "PK_AppUserProjects", table: "AppUserProjects");

            migrationBuilder.AddColumn<Guid>(
                name: "NegativeToProjectId",
                table: "PanelLinks",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000")
            );

            migrationBuilder.AddColumn<Guid>(
                name: "PositiveToProjectId",
                table: "PanelLinks",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000")
            );

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Strings_Id",
                table: "Strings",
                column: "Id"
            );

            migrationBuilder.AddPrimaryKey(
                name: "PK_Strings",
                table: "Strings",
                columns: new[] { "Id", "ProjectId" }
            );

            migrationBuilder.AddPrimaryKey(
                name: "PK_Panels",
                table: "Panels",
                columns: new[] { "Id", "ProjectId" }
            );

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppUserProjects",
                table: "AppUserProjects",
                columns: new[] { "AppUserId", "ProjectId" }
            );

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_NegativeToId_NegativeToProjectId",
                table: "PanelLinks",
                columns: new[] { "NegativeToId", "NegativeToProjectId" }
            );

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_PositiveToId_PositiveToProjectId",
                table: "PanelLinks",
                columns: new[] { "PositiveToId", "PositiveToProjectId" }
            );

            migrationBuilder.AddForeignKey(
                name: "FK_PanelLinks_Panels_NegativeToId_NegativeToProjectId",
                table: "PanelLinks",
                columns: new[] { "NegativeToId", "NegativeToProjectId" },
                principalTable: "Panels",
                principalColumns: new[] { "Id", "ProjectId" },
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_PanelLinks_Panels_PositiveToId_PositiveToProjectId",
                table: "PanelLinks",
                columns: new[] { "PositiveToId", "PositiveToProjectId" },
                principalTable: "Panels",
                principalColumns: new[] { "Id", "ProjectId" },
                onDelete: ReferentialAction.Cascade
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PanelLinks_Panels_NegativeToId_NegativeToProjectId",
                table: "PanelLinks"
            );

            migrationBuilder.DropForeignKey(
                name: "FK_PanelLinks_Panels_PositiveToId_PositiveToProjectId",
                table: "PanelLinks"
            );

            migrationBuilder.DropUniqueConstraint(name: "AK_Strings_Id", table: "Strings");

            migrationBuilder.DropPrimaryKey(name: "PK_Strings", table: "Strings");

            migrationBuilder.DropPrimaryKey(name: "PK_Panels", table: "Panels");

            migrationBuilder.DropIndex(
                name: "IX_PanelLinks_NegativeToId_NegativeToProjectId",
                table: "PanelLinks"
            );

            migrationBuilder.DropIndex(
                name: "IX_PanelLinks_PositiveToId_PositiveToProjectId",
                table: "PanelLinks"
            );

            migrationBuilder.DropPrimaryKey(name: "PK_AppUserProjects", table: "AppUserProjects");

            migrationBuilder.DropColumn(name: "NegativeToProjectId", table: "PanelLinks");

            migrationBuilder.DropColumn(name: "PositiveToProjectId", table: "PanelLinks");

            migrationBuilder.AddPrimaryKey(name: "PK_Strings", table: "Strings", column: "Id");

            migrationBuilder.AddPrimaryKey(name: "PK_Panels", table: "Panels", column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppUserProjects",
                table: "AppUserProjects",
                column: "Id"
            );

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_NegativeToId",
                table: "PanelLinks",
                column: "NegativeToId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_PositiveToId",
                table: "PanelLinks",
                column: "PositiveToId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_PanelLinks_Panels_NegativeToId",
                table: "PanelLinks",
                column: "NegativeToId",
                principalTable: "Panels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );

            migrationBuilder.AddForeignKey(
                name: "FK_PanelLinks_Panels_PositiveToId",
                table: "PanelLinks",
                column: "PositiveToId",
                principalTable: "Panels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }
    }
}

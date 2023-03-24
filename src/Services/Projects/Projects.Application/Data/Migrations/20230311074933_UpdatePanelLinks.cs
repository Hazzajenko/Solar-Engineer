using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePanelLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PanelLinks_Panels_NegativeToId_NegativeToProjectId",
                table: "PanelLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_PanelLinks_Panels_PositiveToId_PositiveToProjectId",
                table: "PanelLinks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PanelLinks",
                table: "PanelLinks");

            migrationBuilder.DropIndex(
                name: "IX_PanelLinks_NegativeToId_NegativeToProjectId",
                table: "PanelLinks");

            migrationBuilder.DropIndex(
                name: "IX_PanelLinks_PositiveToId_PositiveToProjectId",
                table: "PanelLinks");

            migrationBuilder.DropColumn(
                name: "NegativeToId",
                table: "PanelLinks");

            migrationBuilder.RenameColumn(
                name: "PositiveToProjectId",
                table: "PanelLinks",
                newName: "StringId");

            migrationBuilder.RenameColumn(
                name: "PositiveToId",
                table: "PanelLinks",
                newName: "PanelPositiveToId");

            migrationBuilder.RenameColumn(
                name: "NegativeToProjectId",
                table: "PanelLinks",
                newName: "PanelNegativeToId");

            migrationBuilder.AddColumn<Guid>(
                name: "LinkNegativeToId",
                table: "Panels",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LinkPositiveToId",
                table: "Panels",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "PanelLinks",
                type: "uuid",
                nullable: false,
                defaultValueSql: "uuid_generate_v4()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_PanelLinks_Id",
                table: "PanelLinks",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PanelLinks",
                table: "PanelLinks",
                columns: new[] { "Id", "ProjectId" });

            migrationBuilder.CreateIndex(
                name: "IX_Panels_LinkNegativeToId",
                table: "Panels",
                column: "LinkNegativeToId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Panels_LinkPositiveToId",
                table: "Panels",
                column: "LinkPositiveToId",
                unique: true);

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
                name: "FK_Panels_PanelLinks_LinkNegativeToId",
                table: "Panels",
                column: "LinkNegativeToId",
                principalTable: "PanelLinks",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Panels_PanelLinks_LinkPositiveToId",
                table: "Panels",
                column: "LinkPositiveToId",
                principalTable: "PanelLinks",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PanelLinks_Strings_StringId",
                table: "PanelLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_Panels_PanelLinks_LinkNegativeToId",
                table: "Panels");

            migrationBuilder.DropForeignKey(
                name: "FK_Panels_PanelLinks_LinkPositiveToId",
                table: "Panels");

            migrationBuilder.DropIndex(
                name: "IX_Panels_LinkNegativeToId",
                table: "Panels");

            migrationBuilder.DropIndex(
                name: "IX_Panels_LinkPositiveToId",
                table: "Panels");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_PanelLinks_Id",
                table: "PanelLinks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PanelLinks",
                table: "PanelLinks");

            migrationBuilder.DropIndex(
                name: "IX_PanelLinks_StringId",
                table: "PanelLinks");

            migrationBuilder.DropColumn(
                name: "LinkNegativeToId",
                table: "Panels");

            migrationBuilder.DropColumn(
                name: "LinkPositiveToId",
                table: "Panels");

            migrationBuilder.RenameColumn(
                name: "StringId",
                table: "PanelLinks",
                newName: "PositiveToProjectId");

            migrationBuilder.RenameColumn(
                name: "PanelPositiveToId",
                table: "PanelLinks",
                newName: "PositiveToId");

            migrationBuilder.RenameColumn(
                name: "PanelNegativeToId",
                table: "PanelLinks",
                newName: "NegativeToProjectId");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "PanelLinks",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "uuid_generate_v4()");

            migrationBuilder.AddColumn<Guid>(
                name: "NegativeToId",
                table: "PanelLinks",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PanelLinks",
                table: "PanelLinks",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_NegativeToId_NegativeToProjectId",
                table: "PanelLinks",
                columns: new[] { "NegativeToId", "NegativeToProjectId" });

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_PositiveToId_PositiveToProjectId",
                table: "PanelLinks",
                columns: new[] { "PositiveToId", "PositiveToProjectId" });

            migrationBuilder.AddForeignKey(
                name: "FK_PanelLinks_Panels_NegativeToId_NegativeToProjectId",
                table: "PanelLinks",
                columns: new[] { "NegativeToId", "NegativeToProjectId" },
                principalTable: "Panels",
                principalColumns: new[] { "Id", "ProjectId" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PanelLinks_Panels_PositiveToId_PositiveToProjectId",
                table: "PanelLinks",
                columns: new[] { "PositiveToId", "PositiveToProjectId" },
                principalTable: "Panels",
                principalColumns: new[] { "Id", "ProjectId" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePanelLinkPropertyNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Points",
                table: "PanelLinks",
                newName: "LinePoints");

            migrationBuilder.RenameColumn(
                name: "PanelPositiveToId",
                table: "PanelLinks",
                newName: "PositivePanelId");

            migrationBuilder.RenameColumn(
                name: "PanelNegativeToId",
                table: "PanelLinks",
                newName: "NegativePanelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PositivePanelId",
                table: "PanelLinks",
                newName: "PanelPositiveToId");

            migrationBuilder.RenameColumn(
                name: "NegativePanelId",
                table: "PanelLinks",
                newName: "PanelNegativeToId");

            migrationBuilder.RenameColumn(
                name: "LinePoints",
                table: "PanelLinks",
                newName: "Points");
        }
    }
}

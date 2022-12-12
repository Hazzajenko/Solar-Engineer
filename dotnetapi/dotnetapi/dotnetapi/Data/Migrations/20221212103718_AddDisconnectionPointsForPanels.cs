using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDisconnectionPointsForPanels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DisconnectionPointPanelLinkId",
                table: "Panels",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDisconnectionPoint",
                table: "Panels",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DisconnectionPointPanelId",
                table: "PanelLinks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDisconnectionPoint",
                table: "PanelLinks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_DisconnectionPointPanelId",
                table: "PanelLinks",
                column: "DisconnectionPointPanelId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PanelLinks_Panels_DisconnectionPointPanelId",
                table: "PanelLinks",
                column: "DisconnectionPointPanelId",
                principalTable: "Panels",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PanelLinks_Panels_DisconnectionPointPanelId",
                table: "PanelLinks");

            migrationBuilder.DropIndex(
                name: "IX_PanelLinks_DisconnectionPointPanelId",
                table: "PanelLinks");

            migrationBuilder.DropColumn(
                name: "DisconnectionPointPanelLinkId",
                table: "Panels");

            migrationBuilder.DropColumn(
                name: "IsDisconnectionPoint",
                table: "Panels");

            migrationBuilder.DropColumn(
                name: "DisconnectionPointPanelId",
                table: "PanelLinks");

            migrationBuilder.DropColumn(
                name: "IsDisconnectionPoint",
                table: "PanelLinks");
        }
    }
}

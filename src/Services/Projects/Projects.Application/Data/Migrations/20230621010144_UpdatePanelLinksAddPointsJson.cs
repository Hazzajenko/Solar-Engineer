using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Projects.Domain.Entities;

#nullable disable

namespace Projects.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePanelLinksAddPointsJson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<IEnumerable<PanelLink.LinePoint>>(
                name: "Points",
                table: "PanelLinks",
                type: "jsonb",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Points",
                table: "PanelLinks");
        }
    }
}

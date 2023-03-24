using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPanelsPanelConfigsStringsPanelLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PanelConfigs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Brand = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CurrentAtMaximumPower = table.Column<double>(type: "double precision", nullable: false),
                    ShortCircuitCurrent = table.Column<double>(type: "double precision", nullable: false),
                    ShortCircuitCurrentTemp = table.Column<double>(type: "double precision", nullable: false),
                    Length = table.Column<double>(type: "double precision", nullable: false),
                    MaximumPower = table.Column<double>(type: "double precision", nullable: false),
                    MaximumPowerTemp = table.Column<double>(type: "double precision", nullable: false),
                    VoltageAtMaximumPower = table.Column<double>(type: "double precision", nullable: false),
                    OpenCircuitVoltage = table.Column<double>(type: "double precision", nullable: false),
                    OpenCircuitVoltageTemp = table.Column<double>(type: "double precision", nullable: false),
                    Weight = table.Column<double>(type: "double precision", nullable: false),
                    Width = table.Column<double>(type: "double precision", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PanelConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Strings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    Parallel = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Strings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Strings_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Panels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StringId = table.Column<Guid>(type: "uuid", nullable: false),
                    PanelConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Panels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Panels_PanelConfigs_PanelConfigId",
                        column: x => x.PanelConfigId,
                        principalTable: "PanelConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Panels_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Panels_Strings_StringId",
                        column: x => x.StringId,
                        principalTable: "Strings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PanelLinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StringId = table.Column<Guid>(type: "uuid", nullable: false),
                    PositiveToId = table.Column<Guid>(type: "uuid", nullable: false),
                    NegativeToId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PanelLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PanelLinks_Panels_NegativeToId",
                        column: x => x.NegativeToId,
                        principalTable: "Panels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PanelLinks_Panels_PositiveToId",
                        column: x => x.PositiveToId,
                        principalTable: "Panels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PanelLinks_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PanelLinks_Strings_StringId",
                        column: x => x.StringId,
                        principalTable: "Strings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_NegativeToId",
                table: "PanelLinks",
                column: "NegativeToId");

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_PositiveToId",
                table: "PanelLinks",
                column: "PositiveToId");

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_ProjectId",
                table: "PanelLinks",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_PanelLinks_StringId",
                table: "PanelLinks",
                column: "StringId");

            migrationBuilder.CreateIndex(
                name: "IX_Panels_PanelConfigId",
                table: "Panels",
                column: "PanelConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_Panels_ProjectId",
                table: "Panels",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Panels_StringId",
                table: "Panels",
                column: "StringId");

            migrationBuilder.CreateIndex(
                name: "IX_Strings_ProjectId",
                table: "Strings",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PanelLinks");

            migrationBuilder.DropTable(
                name: "Panels");

            migrationBuilder.DropTable(
                name: "PanelConfigs");

            migrationBuilder.DropTable(
                name: "Strings");
        }
    }
}

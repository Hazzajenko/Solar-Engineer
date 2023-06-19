using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projects.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUndefinedStringToProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UndefinedStringId",
                table: "Projects",
                type: "uuid",
                nullable: false,
                defaultValueSql: "uuid_generate_v4()");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UndefinedStringId",
                table: "Projects");
        }
    }
}

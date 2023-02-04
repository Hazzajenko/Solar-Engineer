using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace dotnetapi.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditAppUserLinkKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AppUserLinks",
                table: "AppUserLinks");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "AppUserLinks",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppUserLinks",
                table: "AppUserLinks",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_AppUserLinks_AppUserRequestedId",
                table: "AppUserLinks",
                column: "AppUserRequestedId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AppUserLinks",
                table: "AppUserLinks");

            migrationBuilder.DropIndex(
                name: "IX_AppUserLinks_AppUserRequestedId",
                table: "AppUserLinks");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "AppUserLinks",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppUserLinks",
                table: "AppUserLinks",
                columns: new[] { "AppUserRequestedId", "AppUserReceivedId" });
        }
    }
}

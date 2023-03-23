using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Application.Data.Migrations
{
    /// <inheritdoc />
    public partial class MigrateUsersToIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql($"CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "AspNetUsers",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "AspNetUsers",
                type: "uuid",
                nullable: false,
                defaultValueSql: "uuid_generate_v4()",
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid ()"
            );

            migrationBuilder.CreateTable(
                name: "UserLinks",
                columns: table =>
                    new
                    {
                        AppUserRequestedId = table.Column<Guid>(type: "uuid", nullable: false),
                        AppUserReceivedId = table.Column<Guid>(type: "uuid", nullable: false),
                        AppUserRequestedDisplayName = table.Column<string>(
                            type: "text",
                            nullable: false
                        ),
                        AppUserReceivedDisplayName = table.Column<string>(
                            type: "text",
                            nullable: false
                        ),
                        BecameFriendsTime = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: true
                        ),
                        Friends = table.Column<bool>(type: "boolean", nullable: false),
                        AppUserRequestedStatusEvent = table.Column<string>(
                            type: "text",
                            nullable: false
                        ),
                        AppUserRequestedStatusTime = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: false
                        ),
                        AppUserReceivedStatusEvent = table.Column<string>(
                            type: "text",
                            nullable: false
                        ),
                        AppUserReceivedStatusTime = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: false
                        ),
                        CreatedTime = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: false
                        ),
                        LastModifiedTime = table.Column<DateTime>(
                            type: "timestamp with time zone",
                            nullable: false
                        )
                    },
                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_UserLinks",
                        x => new { x.AppUserRequestedId, x.AppUserReceivedId }
                    );
                    table.ForeignKey(
                        name: "FK_UserLinks_AspNetUsers_AppUserReceivedId",
                        column: x => x.AppUserReceivedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_UserLinks_AspNetUsers_AppUserRequestedId",
                        column: x => x.AppUserRequestedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_UserLinks_AppUserReceivedId",
                table: "UserLinks",
                column: "AppUserReceivedId"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "UserLinks");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "AspNetUsers",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256
            );

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "AspNetUsers",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid ()",
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "uuid_generate_v4()"
            );
        }
    }
}

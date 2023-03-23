#nullable disable

using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Identity.API.Deprecated.Data.Migrations.PersistedGrantDb;

/// <inheritdoc />
public partial class InitialIdentityServerPersistedGrantDbMigration : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            "DeviceCodes",
            table => new
            {
                UserCode = table.Column<string>("character varying(200)", maxLength: 200, nullable: false),
                DeviceCode = table.Column<string>("character varying(200)", maxLength: 200, nullable: false),
                SubjectId = table.Column<string>("character varying(200)", maxLength: 200, nullable: true),
                SessionId = table.Column<string>("character varying(100)", maxLength: 100, nullable: true),
                ClientId = table.Column<string>("character varying(200)", maxLength: 200, nullable: false),
                Description = table.Column<string>("character varying(200)", maxLength: 200, nullable: true),
                CreationTime = table.Column<DateTime>("timestamp with time zone", nullable: false),
                Expiration = table.Column<DateTime>("timestamp with time zone", nullable: false),
                Data = table.Column<string>("character varying(50000)", maxLength: 50000, nullable: false)
            },
            constraints: table => { table.PrimaryKey("PK_DeviceCodes", x => x.UserCode); });

        migrationBuilder.CreateTable(
            "Keys",
            table => new
            {
                Id = table.Column<string>("text", nullable: false),
                Version = table.Column<int>("integer", nullable: false),
                Created = table.Column<DateTime>("timestamp with time zone", nullable: false),
                Use = table.Column<string>("text", nullable: true),
                Algorithm = table.Column<string>("character varying(100)", maxLength: 100, nullable: false),
                IsX509Certificate = table.Column<bool>("boolean", nullable: false),
                DataProtected = table.Column<bool>("boolean", nullable: false),
                Data = table.Column<string>("text", nullable: false)
            },
            constraints: table => { table.PrimaryKey("PK_Keys", x => x.Id); });

        migrationBuilder.CreateTable(
            "PersistedGrants",
            table => new
            {
                Id = table.Column<long>("bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy",
                        NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                Key = table.Column<string>("character varying(200)", maxLength: 200, nullable: true),
                Type = table.Column<string>("character varying(50)", maxLength: 50, nullable: false),
                SubjectId = table.Column<string>("character varying(200)", maxLength: 200, nullable: true),
                SessionId = table.Column<string>("character varying(100)", maxLength: 100, nullable: true),
                ClientId = table.Column<string>("character varying(200)", maxLength: 200, nullable: false),
                Description = table.Column<string>("character varying(200)", maxLength: 200, nullable: true),
                CreationTime = table.Column<DateTime>("timestamp with time zone", nullable: false),
                Expiration = table.Column<DateTime>("timestamp with time zone", nullable: true),
                ConsumedTime = table.Column<DateTime>("timestamp with time zone", nullable: true),
                Data = table.Column<string>("character varying(50000)", maxLength: 50000, nullable: false)
            },
            constraints: table => { table.PrimaryKey("PK_PersistedGrants", x => x.Id); });

        migrationBuilder.CreateTable(
            "ServerSideSessions",
            table => new
            {
                Id = table.Column<int>("integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy",
                        NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                Key = table.Column<string>("character varying(100)", maxLength: 100, nullable: false),
                Scheme = table.Column<string>("character varying(100)", maxLength: 100, nullable: false),
                SubjectId = table.Column<string>("character varying(100)", maxLength: 100, nullable: false),
                SessionId = table.Column<string>("character varying(100)", maxLength: 100, nullable: true),
                DisplayName = table.Column<string>("character varying(100)", maxLength: 100, nullable: true),
                Created = table.Column<DateTime>("timestamp with time zone", nullable: false),
                Renewed = table.Column<DateTime>("timestamp with time zone", nullable: false),
                Expires = table.Column<DateTime>("timestamp with time zone", nullable: true),
                Data = table.Column<string>("text", nullable: false)
            },
            constraints: table => { table.PrimaryKey("PK_ServerSideSessions", x => x.Id); });

        migrationBuilder.CreateIndex(
            "IX_DeviceCodes_DeviceCode",
            "DeviceCodes",
            "DeviceCode",
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_DeviceCodes_Expiration",
            "DeviceCodes",
            "Expiration");

        migrationBuilder.CreateIndex(
            "IX_Keys_Use",
            "Keys",
            "Use");

        migrationBuilder.CreateIndex(
            "IX_PersistedGrants_ConsumedTime",
            "PersistedGrants",
            "ConsumedTime");

        migrationBuilder.CreateIndex(
            "IX_PersistedGrants_Expiration",
            "PersistedGrants",
            "Expiration");

        migrationBuilder.CreateIndex(
            "IX_PersistedGrants_Key",
            "PersistedGrants",
            "Key",
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_PersistedGrants_SubjectId_ClientId_Type",
            "PersistedGrants",
            new[] { "SubjectId", "ClientId", "Type" });

        migrationBuilder.CreateIndex(
            "IX_PersistedGrants_SubjectId_SessionId_Type",
            "PersistedGrants",
            new[] { "SubjectId", "SessionId", "Type" });

        migrationBuilder.CreateIndex(
            "IX_ServerSideSessions_DisplayName",
            "ServerSideSessions",
            "DisplayName");

        migrationBuilder.CreateIndex(
            "IX_ServerSideSessions_Expires",
            "ServerSideSessions",
            "Expires");

        migrationBuilder.CreateIndex(
            "IX_ServerSideSessions_Key",
            "ServerSideSessions",
            "Key",
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_ServerSideSessions_SessionId",
            "ServerSideSessions",
            "SessionId");

        migrationBuilder.CreateIndex(
            "IX_ServerSideSessions_SubjectId",
            "ServerSideSessions",
            "SubjectId");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            "DeviceCodes");

        migrationBuilder.DropTable(
            "Keys");

        migrationBuilder.DropTable(
            "PersistedGrants");

        migrationBuilder.DropTable(
            "ServerSideSessions");
    }
}
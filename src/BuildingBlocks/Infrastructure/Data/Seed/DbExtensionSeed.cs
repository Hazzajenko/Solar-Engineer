﻿using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seed;

public class DbExtensionSeed<TContext>
    where TContext : DbContext
{
    public static async Task<int> CreateUuidOsspIfNotExists(TContext context)
    {
        return await context.Database.ExecuteSqlAsync(
            $"CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\""
        );
    }

    public static async Task<int> CreateDatabaseIfNotExists(TContext context, string databaseName)
    {
        return await context.Database.ExecuteSqlRawAsync(
            $"CREATE DATABASE IF NOT EXISTS {databaseName}"
        );
    }
}
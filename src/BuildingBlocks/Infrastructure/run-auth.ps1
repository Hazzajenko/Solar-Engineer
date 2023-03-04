$rootPath = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

function runAuth()
{
    dotnet run --project $rootPath\Services\Auth.API\Auth.API.csproj
}
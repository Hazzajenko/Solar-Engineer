
$location = [string](Get-Location)
Write-Host "dotnet run --project ${location}\src\Services\Identity\Identity.API\Identity.API.csproj"
dotnet run --project ${location}\src\Services\Identity\Identity.API\Identity.API.csproj --launch-profile Identity-Api-Https
